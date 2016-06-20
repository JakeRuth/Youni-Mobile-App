'use strict';

var React = require('react-native');
var Unicycle = require('../Unicycle');
var homePostsStore = require('../stores/post/HomePostsStore');
var userLoginMetadataStore = require('../stores/UserLoginMetadataStore');
var MainScreenBanner = require('../MainScreenBanner');
var PostList = require('../Components/Post/PostList');
var ErrorPage = require('../Components/Common/ErrorPage');
var CacheUtils = require('../Utils/Common/CacheUtils');
var Spinner = require('../Components/Common/Spinner');

var {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  AppRegistry
} = React;

var styles = StyleSheet.create({
  homePageContainer: {
    flex: 1
  },
  feedContainer: {
    flex: 20,
    paddingBottom: 50
  },
  emptyPostsMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },
  noPostsTitle: {
    textAlign: 'center',
    fontSize: 20,
    paddingBottom: 20
  },
  noPostSubTitle: {
    textAlign: 'center',
    color: 'gray'
  },
  logoContainer: {
    position: 'absolute',
    top: 16,
    width: Dimensions.get('window').width
  },
  logo: {
    alignSelf: 'center',
    height: 42,
    width: 108
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
      content = this._renderEmptyPostsMessage();
    }

    return (
      <View style={styles.homePageContainer}>

        <MainScreenBanner/>
        <View style={styles.feedContainer}>
          { content }
        </View>

        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require('../images/logoWhiteTextBlankBackground.png')}/>
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
        onSubmitCommentCallback={homePostsStore.addCommentOnPost}
        onScroll={this.handleScroll}
        onLoadMorePostsPress={this._requestHomeFeed}
        isNextPageLoading={homePostsStore.isLoadMorePostsRequestInFlight()}
        noMorePostsToFetch={homePostsStore.getNoMorePostsToFetch()}
        likePhotoAction={this.likePhotoAction}
        unlikePhotoAction={this.unlikePhotoAction}
        onSubmitCommentAction={this.onSubmitCommentAction}
        navigator={this.props.navigator}/>
    );
  },

  _renderEmptyPostsMessage: function() {
    return (
      <View style={styles.emptyPostsMessageContainer}>
        <Text style={styles.noPostsTitle}>No posts from any one you are following</Text>
        <Text style={styles.noPostSubTitle}>As you follow your friends, only their posts will show up in this feed</Text>
      </View>
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
