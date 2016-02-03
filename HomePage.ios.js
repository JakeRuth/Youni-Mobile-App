'use strict';

var React = require('react-native');
var Unicycle = require('./Unicycle');
var homePostsStore = require('./stores/post/HomePostsStore');
var userLoginMetadataStore = require('./stores/UserLoginMetadataStore');
var MainScreenBanner = require('./MainScreenBanner');
var PostList = require('./Components/Post/PostList');
var ErrorPage = require('./Components/Common/ErrorPage');
var Spinner = require('./Components/Common/Spinner');

var {
  View,
  Text,
  StyleSheet,
  AppRegistry
} = React

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
  }
});

var HomePage = React.createClass({

  mixins: [
    Unicycle.listenTo(homePostsStore),
    Unicycle.listenTo(userLoginMetadataStore)
  ],

  componentDidMount: function() {
    this._requestFeeds();
  },

  render: function() {
    var loadingPosts = homePostsStore.isRequestInFlight(),
        anyErrorsLoadingPage = homePostsStore.anyErrorsLoadingPage(),
        homeFeedPosts = homePostsStore.getPosts(),
        content;

    if (loadingPosts) {
      content = <Spinner
        color='black'/>;
    }
    else if (anyErrorsLoadingPage) {
      content = <ErrorPage reloadButtonAction={this._requestFeeds}/>
    }
    else if (homeFeedPosts.size) {
      content = this._renderPosts(homeFeedPosts);
    }
    else {
      content = this._renderEmptyPostsMessage();
    }

    return (
      <View style={styles.homePageContainer}>
        <MainScreenBanner title='Youni'/>
        <View style={styles.feedContainer}>
          { content }
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
        refreshable={true}
        postStore={homePostsStore}
        posts={posts}
        onScroll={this.handleScroll}
        onLoadMorePostsPress={this._requestFeeds}
        isLoadMorePostsRequestInFlight={homePostsStore.isLoadMorePostsRequestInFlight()} />
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

  _requestFeeds: function() {
    var id = userLoginMetadataStore.getUserId();
    Unicycle.exec('requestHomeFeed', id);
    Unicycle.exec('requestExploreFeed', id);
  }

});

module.exports = HomePage;
