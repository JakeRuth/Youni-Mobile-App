'use strict';

var React = require('react-native');
var Unicycle = require('./Unicycle');
var homePostsStore = require('./stores/post/HomePostsStore');
var userLoginMetadataStore = require('./stores/UserLoginMetadataStore');
var MainScreenBanner = require('./MainScreenBanner');
var PostList = require('./Components/Post/PostList');

var {
  View,
  Text,
  StyleSheet,
  AppRegistry,
  ActivityIndicatorIOS
} = React

var styles = StyleSheet.create({
  homePageContainer: {
    flex: 1
  },
  feedContainer: {
    flex: 20,
    marginTop: 10,
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
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

var HomePage = React.createClass({

  mixins: [
    Unicycle.listenTo(homePostsStore),
    Unicycle.listenTo(userLoginMetadataStore)
  ],

  componentDidMount: function() {
    var userId = userLoginMetadataStore.getUserId();
    Unicycle.exec('requestHomeFeed', userId);
  },

  render: function() {
    var loadingPosts = homePostsStore.isRequestInFlight(),
        homeFeedPosts = homePostsStore.getPosts(),
        content;

    if (loadingPosts) {
      content = this.renderLoadingSpinner();
    }
    else if (homeFeedPosts.size) {
      content = (
        <PostList
          postStore={homePostsStore}
          posts={homeFeedPosts}
          onScroll={this.handleScroll}
          onLoadMorePostsPress={this.onLoadMorePostsPress}
          isLoadMorePostsRequestInFlight={homePostsStore.isLoadMorePostsRequestInFlight()} />
      );
    }
    else {
      content = this.renderEmptyPostsMessage();
    }

    return (
      <View style={styles.homePageContainer}>
        <MainScreenBanner
          title='Home Feed'
          subTitle='Posts from the people YOU care about'/>
        <View style={styles.feedContainer}>
          { content }
        </View>
      </View>
    );
  },

  renderEmptyPostsMessage: function() {
    return (
      <View style={styles.emptyPostsMessageContainer}>
        <Text style={styles.noPostsTitle}>No posts from any one you are following</Text>
        <Text style={styles.noPostSubTitle}>As you follow your friends, only their posts will show up in this feed</Text>
      </View>
    );
  },

  renderLoadingSpinner: function() {
    return (
      <View style={styles.spinnerContainer}>
        <ActivityIndicatorIOS
          size="small"
          color="black"
          animating={true}
          style={styles.spinner} />
      </View>
    );
  },

  handleScroll(e) {
    var inifiniteScrollThreshold = -15,
        userId = userLoginMetadataStore.getUserId();

    if (e.nativeEvent.contentOffset.y < inifiniteScrollThreshold) {
      Unicycle.exec('refreshHomeFeedData');
      Unicycle.exec('requestHomeFeed', userId);
    }
  },

  onLoadMorePostsPress: function() {
    var userId = userLoginMetadataStore.getUserId();
    Unicycle.exec('requestHomeFeed', userId);
  }

});

module.exports = HomePage;
