'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var explorePostsStore = require('../../stores/post/ExplorePostsStore');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var PostList = require('./PostList');
var ErrorPage = require('../Common/ErrorPage');
var Spinner = require('../Common/Spinner');

var {
  View,
  Text,
  StyleSheet
} = React

var styles = StyleSheet.create({
  exploreFeedContainer: {
    flex: 1,
    paddingBottom: 50
  }
});

var ExploreFeedPosts = React.createClass({

  mixins: [
    Unicycle.listenTo(explorePostsStore),
    Unicycle.listenTo(userLoginMetadataStore)
  ],

  render: function() {
    var loadingPosts = explorePostsStore.isRequestInFlight(),
        anyErrorsLoadingPage = explorePostsStore.anyErrorsLoadingPage(),
        content;

    if (loadingPosts) {
      content = (
        <Spinner
          color={'black'}/>
      );
    }
    else if (anyErrorsLoadingPage) {
      content = <ErrorPage reloadButtonAction={this._onErrorPageReload}/>
    }
    else {
      content = (
        <PostList
          refreshable={true}
          postStore={explorePostsStore}
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

  handleScroll(e) {
    var inifiniteScrollThreshold = -1,
        userId = userLoginMetadataStore.getUserId();

    if (e.nativeEvent.contentOffset.y < inifiniteScrollThreshold) {
      Unicycle.exec('refreshExploreFeed', userId);
    }
  },

  onLoadMorePostsPress: function() {
    var userId = userLoginMetadataStore.getUserId();
    Unicycle.exec('requestExploreFeed', userId);
  },

  _onErrorPageReload: function() {
    var id = userLoginMetadataStore.getUserId();
    Unicycle.exec('requestExploreFeed', id);
  }

});

module.exports = ExploreFeedPosts;
