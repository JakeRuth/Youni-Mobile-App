'use strict';

var React = require('react-native');
var immutable = require('immutable');
var Unicycle = require('../../Unicycle');

var profileStore = require('../../stores/profile/ProfileStore');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var ProfilePageBody = require('../Profile/ProfilePageBody');
var UserPosts = require('../Profile/UserPosts');
var Spinner = require('../Common/Spinner');
var OverlayPage = require('../Common/OverlayPage');

var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var UserUtils = require('../../Utils/User/UserUtils');
var PostUtils = require('../../Utils/Post/PostUtils');

var INITIAL_PAGE_OFFSET = 0;
var MAX_POSTS_PER_PAGE = 10;

var {
  View,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  spinnerContainer: {
    alignSelf: 'center'
  }
});

var ProfilePopup = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired,
    profileUserEmail: React.PropTypes.string.isRequired
  },

  getInitialState: function() {
    return {
      user: {},
      posts: [],
      profileLoading: true,
      postsLoading: false,
      postsNextPageLoading: false,
      isLikeRequestInFlight: false, // Only used to not spam like requests when request is already in flight
      postOffset: INITIAL_PAGE_OFFSET,
      noMorePostsToFetch: false
    };
  },

  componentDidMount() {
    this._requestProfileInformation();
    this._requestUserPosts();
  },

  render: function() {
    var content, userPosts;

    if (this.state.profileLoading) {
      content = (
        <View style={styles.spinnerContainer}>
          <Spinner/>
        </View>
      );
    }
    else {
      content = (
        <View>
          {this._renderProfile(this.state.user)}
          {this._renderProfilePosts()}
        </View>
      );
    }

    return (
      <OverlayPage
        content={content}
        onBackArrowPress={() => {this.props.navigator.pop();}}
        bannerTitle={this._getBannerTitle()}/>
    );
  },

  _renderProfile: function(user) {
    return (
      <ProfilePageBody
        viewerIsProfileOwner={false}
        user={user}
        navigator={this.props.navigator}/>
    );
  },

  _renderProfilePosts: function() {
    return (
      <UserPosts
        posts={immutable.List(this.state.posts)}
        profileStore={profileStore}
        onLoadMorePostsPress={this._requestUserPosts}
        noMorePostsToFetch={this.state.noMorePostsToFetch}
        viewerIsProfileOwner={false}
        loading={this.state.postsLoading}
        isNextPageLoading={this.state.postsNextPageLoading}
        navigator={this.props.navigator}
        likePhotoAction={this._likePhotoAction}
        unlikePhotoAction={this._unlikePhotoAction}
        submitCommentAction={this._submitCommentAction}/>
    );
  },

  _getBannerTitle: function() {
    if (this.state.user.firstName && this.state.user.lastName) {
      return this.state.user.firstName + ' ' + this.state.user.lastName;
    }
    else {
      return '';
    }
  },

  _requestUserPosts: function() {
    var userId = userLoginMetadataStore.getUserId(),
        that = this,
        offset = this.state.postOffset;

    if (offset == INITIAL_PAGE_OFFSET) {
      this.setState({
        postsLoading: true
      });
    }
    else {
      this.setState({
        postsNextPageLoading: true
      });
    }

    AjaxUtils.ajax(
      '/user/getPosts',
      {
        userEmail: that.props.profileUserEmail,
        requestingUserIdString: userId,
        maxNumberOfPostsToFetch: MAX_POSTS_PER_PAGE,
        fetchOffsetAmount: offset
      },
      (res) => {
        var postsArray = PostUtils.createPostsJsonFromGreedy(res.body.posts, offset);
        var newPosts = immutable.List(postsArray);
        var allPosts = immutable.List(that.state.posts).concat(newPosts);

        that.setState({
          posts: allPosts,
          postOffset: offset + MAX_POSTS_PER_PAGE,
          postsLoading: false,
          postsNextPageLoading: false,
          noMorePostsToFetch: !res.body.moreResults
        });
      },
      () => {
        that.setState({
          postsLoading: false,
          postsNextPageLoading: false
        });
      }
    );
  },

  _requestProfileInformation: function() {
    var that = this;

    AjaxUtils.ajax(
      '/user/getProfileInformation',
      {
        userEmail: that.props.profileUserEmail
      },
      (res) => {
        // TODO: Fix this
        res.body.userDetails.totalPoints = res.body.userDetails.allTimePoints;
        that.setState({
          profileLoading: false,
          user: res.body.userDetails
        });
      },
      () => {
        that.setState({
          profileLoading: false
        });
      }
    );
  },

  _likePhotoAction(postIndex, postId, userId, callback) {
    var that = this,
        posts = this.state.posts;

    if (!this.state.isLikeRequestInFlight) {
      this.setState({
        isLikeRequestInFlight: true
      });

      AjaxUtils.ajax(
        '/post/like',
        {
          postIdString: postId,
          userIdString: userId
        },
        (res) => {
          that.setState({
            posts: PostUtils.increaseLikeCount(that.state.posts, postIndex),
            isLikeRequestInFlight: false
          });
          callback();
        },
        () => {
          that.setState({
            isLikeRequestInFlight: false
          });
          callback();
        }
      );
    }
  },

  _unlikePhotoAction(postIndex, postId, userId, callback) {
    var posts = this.state.posts,
        that = this;

    if (!this.state.isLikeRequestInFlight) {
      this.setState({
        isLikeRequestInFlight: true
      });

      AjaxUtils.ajax(
        '/post/removeLike',
        {
          postIdString: postId,
          userIdString: userId
        },
        (res) => {
          that.setState({
            posts: PostUtils.decreaseLikeCount(this.state.posts, postIndex),
            isLikeRequestInFlight: false
          });
          callback();
        },
        () => {
          that.setState({
            isLikeRequestInFlight: false
          });
          callback();
        }
      );
    }
  },

  _submitCommentAction: function(id, postIdString, userIdString, comment, commenterName, callback) {
    var posts = this.state.posts,
        that = this;

    AjaxUtils.ajax(
      '/post/createComment',
      {
        postIdString: postIdString,
        userIdString: userIdString,
        comment: comment
      },
      (res) => {
        that.setState({
          posts: PostUtils.addComment(posts, id, comment, commenterName)
        });
        callback();
      },
      () => {
        callback();
      }
    );
  }

});

module.exports = ProfilePopup;
