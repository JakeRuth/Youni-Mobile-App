'use strict';

var React = require('react-native');
var homePostsStore = require('../../stores/post/HomePostsStore');
var Post = require('./Post');
var PostGrid = require('./PostGrid');
var LoadMoreButton = require('../Common/LoadMoreButton');
var Icon = require('react-native-vector-icons/Ionicons');

var {
  View,
  Text,
  StyleSheet,
  AppRegistry,
  ScrollView,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2F2F2'
  },
  pullDownToRefreshText: {
    alignSelf: 'center',
    marginTop: -20,
    color: 'gray'
  },
  refreshIconContainer: {
    alignItems: 'center'
  }
});

var PostList = React.createClass({

  propTypes: {
    refreshable: React.PropTypes.bool.isRequired,
    postStore: React.PropTypes.any.isRequired,
    posts: React.PropTypes.object.isRequired,
    onScroll: React.PropTypes.func.isRequired,
    onLoadMorePostsPress: React.PropTypes.func.isRequired,
    isLoadMorePostsRequestInFlight: React.PropTypes.bool,
    noMorePostsToFetch: React.PropTypes.bool.isRequired,
    isFeedRefreshing: React.PropTypes.bool,
    viewerIsPostOwner: React.PropTypes.bool,
    renderedFromProfileView: React.PropTypes.bool,
    gridViewEnabled: React.PropTypes.bool,
    navigator: React.PropTypes.object.isRequired,
    likePhotoAction: React.PropTypes.func,
    unlikePhotoAction: React.PropTypes.func,
    onSubmitCommentCallback: React.PropTypes.func.isRequired
  },

  render: function() {
    var contentOffset = null,
        scrollToTopOfPostFeed = homePostsStore.scrollToTopOfPostFeed(),
        feedContainerStyles = [styles.container];

    if (this.props.refreshable && this.props.isFeedRefreshing) {
      feedContainerStyles.push({ opacity:.5 });
    }

    if (scrollToTopOfPostFeed) {
      contentOffset = {x:0,y:0};
      homePostsStore.setScrollToTopOfPostFeed(false);
    }

    return (
      <ScrollView
        style={feedContainerStyles}
        onScroll={this.props.onScroll}
        contentOffset={contentOffset}>

        <Text style={styles.pullDownToRefreshText}>Pull down to refresh</Text>

        {this._renderPosts()}
        {this._renderLoadMorePostsButton()}

      </ScrollView>
    );
  },

  _renderPosts: function() {
    if (this.props.gridViewEnabled) {
      return (
        <PostGrid
          posts={this.props.posts}
          viewerIsPostOwner={this.props.viewerIsPostOwner}
          navigator={this.props.navigator}/>
      );
    }
    else {
      return this._renderPostsSequentially(this.props.posts);
    }
  },

  _renderPostsSequentially: function(postsJson) {
    var posts = [];
    for (var i = 0; i < postsJson.size; i++) {
      var post = postsJson.get(i);
      posts.push(
        <Post
          post={post}
          postStore={this.props.postStore}
          renderedFromProfileView={this.props.renderedFromProfileView}
          viewerIsPostOwner={this.props.viewerIsPostOwner}
          navigator={this.props.navigator}
          likePhotoAction={this.props.likePhotoAction}
          unlikePhotoAction={this.props.unlikePhotoAction}
          onSubmitCommentCallback={this.props.onSubmitCommentCallback}
          key={i}/>
      );
    }
    return posts;
  },

  _renderLoadMorePostsButton: function() {
    return (
        <LoadMoreButton
          onPress={this.props.onLoadMorePostsPress}
          isLoading={this.props.isLoadMorePostsRequestInFlight}
          isVisible={!this.props.noMorePostsToFetch}/>
    );
  }

});

module.exports = PostList;
