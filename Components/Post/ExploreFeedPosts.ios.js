'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');

var PostList = require('./PostList');
var ErrorPage = require('../Common/ErrorPage');
var ListFilter = require('../Common/ListFilter');
var Spinner = require('../Common/Spinner');

var explorePostsStore = require('../../stores/post/ExplorePostsStore');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var PostListFilter = require('../../Utils/Enums/PostListFilter');
var ExploreFeedEndpoints = require('../../Utils/Enums/ExploreFeedEndpoints');

var {
  View,
  Text,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  exploreFeedContainer: {
    flex: 1
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

  getInitialState: function() {
    return {
      selectedFilter: PostListFilter.ALL
    };
  },

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
          posts={explorePostsStore.getPosts()}
          refreshable={true}
          isFeedRefreshing={explorePostsStore.isFeedRefreshing()}
          onScroll={this.handleScroll}
          onLoadMorePostsPress={this._requestExploreFeed}
          isNextPageLoading={explorePostsStore.isLoadMorePostsRequestInFlight()}
          noMorePostsToFetch={explorePostsStore.getNoMorePostsToFetch()}
          gridViewEnabled={true}
          likePhotoAction={this.likePhotoAction}
          unlikePhotoAction={this.unlikePhotoAction}
          onSubmitCommentAction={this.onSubmitCommentAction}
          navigator={this.props.navigator}/>
      );
    }

    return (
      <View style={styles.exploreFeedContainer}>

        <ListFilter
          filters={[PostListFilter.MALE, PostListFilter.ALL, PostListFilter.FEMALE]}
          selectedFilter={this.state.selectedFilter}
          onPress={this.onFilterPress}/>
        {content}

      </View>
    );
  },

  onFilterPress: function(filter) {
    if (explorePostsStore.isFeedRefreshing() || explorePostsStore.isRequestInFlight()) {
      return;
    }
    
    var endpoint;

    if (filter === PostListFilter.ALL) {
      endpoint = ExploreFeedEndpoints.DEFAULT;
    }

    if (filter === PostListFilter.FEMALE) {
      endpoint = ExploreFeedEndpoints.FEMALE;
    }

    if (filter === PostListFilter.MALE) {
      endpoint = ExploreFeedEndpoints.MALE;
    }

    explorePostsStore.setExploreFeedEndpoint(endpoint);
    this.setState({
      selectedFilter: filter
    });
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
  },

  likePhotoAction: function(postIndex, postId, userId, callback) {
    Unicycle.exec('likeExploreFeedPost', postIndex, postId, userId, callback);
  },

  unlikePhotoAction: function(postIndex, postId, userId, callback) {
    Unicycle.exec('removeLikeExploreFeed', postIndex, postId, userId, callback);
  },

  onSubmitCommentAction: function(comment, post, callback) {
    explorePostsStore.addCommentOnPost(comment, post, callback);
  }

});

module.exports = ExploreFeedPosts;
