'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Unicycle = require('../Unicycle');

var NoHomeFeedPostsMessage = require('./NoHomeFeedPostsMessage');
var NotificationIcon = require('./Notification/NotificationIcon');
var PostList = require('./Post/PostList');
var Spinner = require('./Common/Spinner');
var YouniHeader = require('./Common/YouniHeader');
var ErrorPage = require('./Common/ErrorPage');
var ProfileIcon = require('./Profile/ProfileIcon');
var CreatePostButton = require('./CreatePost/CreatePostButton');

var homePostsStore = require('../stores/post/HomePostsStore');
var userLoginMetadataStore = require('../stores/UserLoginMetadataStore');
var CacheUtils = require('../Utils/Common/CacheUtils');
var Colors = require('../Utils/Common/Colors');
var LogoImageSize = require('../Utils/Enums/LogoImageSize');

var {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  AppRegistry
} = ReactNative;

var styles = StyleSheet.create({
  homePageContainer: {
    flex: 1
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  notificationIcon: {
    padding: 12,
    paddingTop: 4
  },
  profileIcon: {
    padding: 12,
    paddingTop: 4
  },
  feedContainer: {
    flex: 1
  },
  logoContainer: {
    flex: 1,
    paddingBottom: 5
  },
  logo: {
    alignSelf: 'center',
    height: LogoImageSize.HEIGHT * .15,
    width: LogoImageSize.WIDTH * .15
  },
  createPostButtonContainer: {
    position: 'absolute',
    bottom: 10,
    // center the button horizontally.  48 is the width on the button
    left: (Dimensions.get('window').width - 48) / 2
  }
});

var HomePage = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

  mixins: [
    Unicycle.listenTo(homePostsStore),
    Unicycle.listenTo(userLoginMetadataStore)
  ],

  componentDidMount: function() {
    CacheUtils.loadHomeFeed();
  },

  render: function() {
    var loadingPosts = homePostsStore.isRequestInFlight(),
        anyErrorsLoadingPage = homePostsStore.anyErrorsLoadingPage(),
        homeFeedPosts = homePostsStore.getPosts(),
        content;

    if (loadingPosts) {
      content = <Spinner/>;
    }
    else if (anyErrorsLoadingPage) {
      content = <ErrorPage reloadButtonAction={this._requestHomeFeed}/>
    }
    else if (homeFeedPosts.size) {
      content = this._renderPosts(homeFeedPosts);
    }
    else {
      content = <NoHomeFeedPostsMessage/>;
    }

    return (
      <View style={styles.homePageContainer}>

        <YouniHeader
          style={styles.pageHeader}
          color={Colors.getPrimaryAppColor()}>
          <ProfileIcon
            style={styles.profileIcon}
            navigator={this.props.navigator}/>
          <View style={styles.logoContainer}>
            <Image
              style={styles.logo}
              source={require('../images/logoWhiteTextBlankBackground.png')}/>
          </View>
          <NotificationIcon
            style={styles.notificationIcon}
            navigator={this.props.navigator}/>
        </YouniHeader>

        <View style={styles.feedContainer}>
          {content}
        </View>

        <View style={styles.createPostButtonContainer}>
          <CreatePostButton navigator={this.props.navigator}/>
        </View>

      </View>
    );
  },

  handleScroll(e) {
    var inifiniteScrollThreshold = -1,
        userId = userLoginMetadataStore.getUserId();

    if (e.nativeEvent.contentOffset.y < inifiniteScrollThreshold) {
      Unicycle.exec('refreshHomeFeed', userId);
    }
  },

  _renderPosts: function(posts) {
    return (
      <PostList
        posts={posts}
        refreshable={true}
        isFeedRefreshing={homePostsStore.isFeedRefreshing()}
        onScroll={this.handleScroll}
        onLoadMorePostsPress={this._requestHomeFeed}
        isNextPageLoading={homePostsStore.isLoadMorePostsRequestInFlight()}
        noMorePostsToFetch={homePostsStore.getNoMorePostsToFetch()}
        likePhotoAction={this.likePhotoAction}
        unlikePhotoAction={this.unlikePhotoAction}
        onSubmitCommentAction={this.onSubmitCommentAction}
        loadMoreButtonStyle={{marginBottom: 70}}
        navigator={this.props.navigator}/>
    );
  },

  _requestHomeFeed: function() {
    var userId = userLoginMetadataStore.getUserId();
    Unicycle.exec('requestHomeFeed', userId);
  },

  likePhotoAction: function(postIndex, postId, userId, callback) {
    Unicycle.exec('likeHomeFeedPost', postIndex, postId, userId, callback);
  },

  unlikePhotoAction: function(postIndex, postId, userId, callback) {
    Unicycle.exec('removeLikeHomeFeed', postIndex, postId, userId, callback);
  },

  onSubmitCommentAction: function(comment, post, callback) {
    homePostsStore.addCommentOnPost(comment, post, callback);
  }

});

module.exports = HomePage;
