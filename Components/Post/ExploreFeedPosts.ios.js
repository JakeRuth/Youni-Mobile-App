'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var explorePostsStore = require('../../stores/post/ExplorePostsStore');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var FeedFilters = require('./FeedFilters');
var PostList = require('./PostList');
var ErrorPage = require('../Common/ErrorPage');
var Spinner = require('../Common/Spinner');

var {
  View,
  Text,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  exploreFeedContainer: {
    flex: 1,
    paddingBottom: 50
  }
});

var ExploreFeedPosts = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

  mixins: [
    Unicycle.listenTo(explorePostsStore),
    Unicycle.listenTo(userLoginMetadataStore)
  ],

  componentDidMount: function() {
    this._requestExploreFeed();
  },

  render: function() {
    var loadingPosts = explorePostsStore.isRequestInFlight(),
        anyErrorsLoadingPage = explorePostsStore.anyErrorsLoadingPage(),
        content;

    if (loadingPosts) {
      content = (
        <Spinner/>
      );
    }
    else if (anyErrorsLoadingPage) {
      content = <ErrorPage reloadButtonAction={this._requestExploreFeed}/>
    }
    else {
      content = (
        <PostList
          refreshable={true}
          isFeedRefreshing={explorePostsStore.isFeedRefreshing()}
          postStore={explorePostsStore}
          posts={explorePostsStore.getPosts()}
          onScroll={this.handleScroll}
          onLoadMorePostsPress={this._requestExploreFeed}
          isLoadMorePostsRequestInFlight={explorePostsStore.isLoadMorePostsRequestInFlight()}
          noMorePostsToFetch={explorePostsStore.getNoMorePostsToFetch()}
          gridViewEnabled={true}
          navigator={this.props.navigator}/>
      );
    }

    return (
      <View style={styles.exploreFeedContainer}>

        <FeedFilters disabled={explorePostsStore.isFeedRefreshing() || explorePostsStore.isRequestInFlight()}/>
        {content}

      </View>
    );
  },

  handleScroll(e) {
    var inifiniteScrollThreshold = -1,
        userId = userLoginMetadataStore.getUserId();

    if (e.nativeEvent.contentOffset.y < inifiniteScrollThreshold) {
      Unicycle.exec('refreshExploreFeed', userId, true);
    }
  },

  _requestExploreFeed: function() {
    var userId = userLoginMetadataStore.getUserId();
    Unicycle.exec('requestExploreFeed', userId, true);
  }

});

module.exports = ExploreFeedPosts;
