'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Unicycle = require('../../Unicycle');

var PostList = require('./PostList');
var ErrorPage = require('../Common/ErrorPage');
var ListFilter = require('../Common/ListFilter');
var Spinner = require('../Common/Spinner');

var explorePostsStore = require('../../stores/post/ExplorePostsStore');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var PostListFilter = require('../../Utils/Enums/PostListFilter');
var ExploreFeedEndpoints = require('../../Utils/Enums/ExploreFeedEndpoints');
var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Text,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  container: {
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
          onLoadMorePostsPress={this._requestExploreFeed}
          isNextPageLoading={explorePostsStore.isLoadMorePostsRequestInFlight()}
          noMorePostsToFetch={explorePostsStore.getNoMorePostsToFetch()}
          gridViewEnabled={true}
          likePhotoAction={this.likePhotoAction}
          unlikePhotoAction={this.unlikePhotoAction}
          onSubmitCommentAction={this.onSubmitCommentAction}
          onDeleteCommentAction={this.onDeleteCommentAction}
          navigator={this.props.navigator}/>
      );
    }

    return (
      <View style={styles.container}>

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
    
    explorePostsStore.setExploreFeedEndpoint(this._getApiPostEndpointForFilter(filter));
    this.setState({
      selectedFilter: filter
    });
  },

  _getApiPostEndpointForFilter: function(filter) {
    if (filter === PostListFilter.ALL) {
      return ExploreFeedEndpoints.DEFAULT;
    }

    if (filter === PostListFilter.FEMALE) {
      return ExploreFeedEndpoints.FEMALE;
    }

    if (filter === PostListFilter.MALE) {
      return ExploreFeedEndpoints.MALE;
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
  },

  onDeleteCommentAction: function(comment, post, callback) {
    explorePostsStore.deleteCommentFromPost(comment, post, callback);
  }

});

module.exports = ExploreFeedPosts;
