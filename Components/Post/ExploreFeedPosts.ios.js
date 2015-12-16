'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var explorePostsStore = require('../../stores/post/ExplorePostsStore');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var PostList = require('./PostList');

var {
  View,
  Text,
  StyleSheet,
  ActivityIndicatorIOS
} = React

var styles = StyleSheet.create({
  exploreFeedContainer: {
    flex: 1,
    marginTop: 10,
    paddingBottom: 50
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

var ExploreFeedPosts = React.createClass({

  mixins: [
    Unicycle.listenTo(explorePostsStore),
    Unicycle.listenTo(userLoginMetadataStore)
  ],

  render: function() {
    var loadingPosts = explorePostsStore.isRequestInFlight(),
        content;

    if (loadingPosts) {
      content = this.renderLoadingSpinner();
    }
    else {
      content = (
        <PostList
          posts={explorePostsStore.getPosts()}
          onScroll={this.handleScroll}
          onLoadMorePostsPress={this.onLoadMorePostsPress}
          isLoadMorePostsRequestInFlight={explorePostsStore.isLoadMorePostsRequestInFlight()} />
      );
    }

    return (
      <View style={styles.exploreFeedContainer}>
        {content}
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
      Unicycle.exec('refreshExploreFeedData');
      Unicycle.exec('requestExploreFeed', userId);
    }
  },

  onLoadMorePostsPress: function() {
    var userId = userLoginMetadataStore.getUserId();
    Unicycle.exec('requestExploreFeed', userId);
  },

});

module.exports = ExploreFeedPosts;
