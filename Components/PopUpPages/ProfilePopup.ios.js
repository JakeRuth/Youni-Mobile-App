'use strict';

var React = require('react-native');
var immutable = require('immutable');
var Unicycle = require('../../Unicycle');

var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var ProfileInfo = require('../Profile/ProfileInfo');
var ProfilePostList = require('../Profile/ProfilePostList');
var BlockUserButton = require('../Profile/BlockUserButton');
var YouniHeader = require('../Common/YouniHeader');
var Spinner = require('../Common/Spinner');
var BackArrow = require('../Common/BackArrow');

var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var UserUtils = require('../../Utils/User/UserUtils');
var PostUtils = require('../../Utils/Post/PostUtils');
var PostViewTypeEnum = require('../../Utils/Post/PostViewTypeEnum');

var INITIAL_PAGE_OFFSET = 0;
var MAX_POSTS_PER_PAGE = 9;

var {
  View,
  Text,
  ScrollView,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  pageHeader: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    color: 'white'
  },
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
      postViewMode: PostViewTypeEnum.LIST,
      profileLoading: true,
      isFollowing: null,
      postsLoading: false,
      postsNextPageLoading: false,
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
    var content;

    if (this.state.profileLoading) {
      content = (
        <View style={styles.spinnerContainer}>
          <Spinner/>
        </View>
      );
    }
    else {
      content = (
        <ScrollView automaticallyAdjustContentInsets={false}>
          {this._renderProfile(this.state.user)}
          {this._renderProfilePosts()}
        </ScrollView>
      );
    }

    return (
      <View style={styles.container}>

        <YouniHeader>
          <Text style={styles.pageHeader}>
            {this._getBannerTitle()}
          </Text>
          <BackArrow onPress={() => {this.props.navigator.pop();}}/>
          <BlockUserButton
            email={this.props.profileUserEmail}
            navigator={this.props.navigator}/>
        </YouniHeader>

        {content}

      </View>
    );
  },

  _renderProfile: function(user) {
    return (
      <ProfileInfo
        user={user}
        currentPostViewMode={this.state.postViewMode}
        onPostViewControlPress={this.onPostViewControlPress}
        isFollowing={this.state.isFollowing}
        followAction={this.followUserRequest}
        unfollowAction={this.unfollowUserRequest}
        navigator={this.props.navigator}/>
    );
  },

  _renderProfilePosts: function() {
    return (
      <ProfilePostList
        posts={immutable.List(this.state.posts)}
        user={this.state.user}
        gridViewEnabled={this.state.postViewMode === PostViewTypeEnum.GRID}
        onPostViewControlPress={this.onPostViewControlPress}
        onLoadMorePostsPress={this._requestUserPosts}
        noMorePostsToFetch={this.state.noMorePostsToFetch}
        viewerIsProfileOwner={false}
        loading={this.state.postsLoading}
        isNextPageLoading={this.state.postsNextPageLoading}
        navigator={this.props.navigator}
        likePhotoAction={this.likePhotoAction}
        unlikePhotoAction={this.unlikePhotoAction}
        onSubmitCommentAction={this.onSubmitCommentAction}
        navigator={this.props.navigator}/>
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

  likePhotoAction(postIndex, postId, userId, callback) {
    var that = this,
        posts = this.state.posts;

    // optimistically like the post
    this.setState({
      posts: PostUtils.increaseLikeCountFromList(that.state.posts, postIndex)
    });

    AjaxUtils.ajax(
      '/post/like',
      {
        postIdString: postId,
        userIdString: userId
      },
      (res) => {
        callback();
      },
      () => {
        callback();
      }
    );
  },

  unlikePhotoAction(postIndex, postId, userId, callback) {
    var posts = this.state.posts,
        that = this;

    // optimistically unlike the post
    this.setState({
      posts: PostUtils.decreaseLikeCountFromList(this.state.posts, postIndex)
    });

    AjaxUtils.ajax(
      '/post/removeLike',
      {
        postIdString: postId,
        userIdString: userId
      },
      (res) => {
        callback();
      },
      () => {
        callback();
      }
    );
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

  onSubmitCommentAction: function(comment, post, callback) {
    var posts = this.state.posts,
        userId = userLoginMetadataStore.getUserId(),
        commenterName = userLoginMetadataStore.getFullName();

    if (!comment) {
      return;
    }

    AjaxUtils.ajax(
      '/post/createComment',
      {
        postIdString: post.postIdString,
        userIdString: userId,
        comment: comment
      },
      (res) => {
        PostUtils.addCommentFromList(posts, post.id, comment, commenterName);
        callback(comment);
      },
      () => {
        callback(comment);
      }
    );
  },

  onPostViewControlPress: function(postViewType) {
    if (this.state.postViewMode === postViewType) {
      return;
    }

    this.setState({
      postViewMode: postViewType
    });
  }

});

module.exports = ProfilePopup;
