'use strict';

var React = require('react-native');
var immutable = require('immutable');
var Unicycle = require('../../Unicycle');

var profileStore = require('../../stores/profile/ProfileStore');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var MainScreenBanner = require('../../MainScreenBanner');
var ProfileInfo = require('../Profile/ProfileInfo');
var UserPosts = require('../Profile/UserPosts');
var BlockUserButton = require('../Profile/BlockUserButton');
var Spinner = require('../Common/Spinner');
var OverlayPage = require('../Common/OverlayPage');
var BackArrow = require('../Common/BackArrow');

var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var UserUtils = require('../../Utils/User/UserUtils');
var PostUtils = require('../../Utils/Post/PostUtils');

var INITIAL_PAGE_OFFSET = 0;
var MAX_POSTS_PER_PAGE = 10;

var {
  View,
  ScrollView,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  spinnerContainer: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center'
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
      isFollowing: null,
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
    this._requestIsUserFollowing();
  },

  render: function() {
    if (this.state.profileLoading) {
      return (
        <View style={styles.spinnerContainer}>
          <Spinner/>
        </View>
      );
    }
    else {
      return (
        <View>

          <MainScreenBanner title={this._getBannerTitle()}/>
          <BackArrow onPress={() => {this.props.navigator.pop();}}/>
          {this._renderBlockUserIcon()}

          <ScrollView automaticallyAdjustContentInsets={false}>
            {this._renderProfile(this.state.user)}
            {this._renderProfilePosts()}
          </ScrollView>

        </View>
      );
    }
  },

  _renderProfile: function(user) {
    return (
      <ProfileInfo
        user={user}
        isFollowing={this.state.isFollowing}
        followAction={this.followUserRequest}
        unfollowAction={this.unfollowUserRequest}
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
        onSubmitCommentCallback={this._onSubmitCommentCallback}/>
    );
  },

  _renderBlockUserIcon: function() {
    return (
      <BlockUserButton email={this.props.profileUserEmail}/>
    )
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
      // optimistically like the post
      this.setState({
        posts: PostUtils.increaseLikeCountFromList(that.state.posts, postIndex),
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
      // optimistically unlike the post
      this.setState({
        posts: PostUtils.decreaseLikeCountFromList(this.state.posts, postIndex),
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

  _requestIsUserFollowing: function() {
    var userId = userLoginMetadataStore.getUserId(),
        that = this;

    AjaxUtils.ajax(
      '/user/isFollowing',
      {
        requestingUserIdString: userId,
        userEmail: that.props.profileUserEmail
      },
      (res) => {
        that.setState({
          isFollowing: res.body.following
        });
      },
      () => {

      }
    );
  },

  followUserRequest: function() {
    var user = this.state.user,
        userId = userLoginMetadataStore.getUserId(),
        that = this;

    this.setState({
      isFollowing: null
    });

    AjaxUtils.ajax(
      '/user/follow',
      {
        requestingUserIdString: userId,
        userToFollowEmail: that.props.profileUserEmail
      },
      (res) => {
        if (res.body.success) {
          user.numFollowers++;
          that.setState({
            user: user,
            isFollowing: true
          });
        }
        else {
          that.setState({
            isFollowing: false
          });
        }
      },
      () => {
        that.setState({
          isFollowing: false
        });
      }
    );
  },

  unfollowUserRequest: function() {
    var user = this.state.user,
        userId = userLoginMetadataStore.getUserId(),
        that = this;

    this.setState({
      isFollowing: null
    });

    AjaxUtils.ajax(
      '/user/removeFollow',
      {
        requestingUserIdString: userId,
        userToNotFollowEmail: that.props.profileUserEmail
      },
      (res) => {
        if (res.body.success) {
          user.numFollowers--;
          that.setState({
            user: user,
            isFollowing: false
          });
        }
        else {
          that.setState({
            isFollowing: true
          });
        }
      },
      () => {
        that.setState({
          isFollowing: true
        });
      }
    );
  },

  _onSubmitCommentCallback: function(post, comment, commenterName) {
    var posts = this.state.posts;

    PostUtils.addCommentFromList(posts, post.id, comment, commenterName);
  }

});

module.exports = ProfilePopup;
