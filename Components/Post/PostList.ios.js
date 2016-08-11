'use strict';

var React = require('react');
var ReactNative = require('react-native');
var homePostsStore = require('../../stores/post/HomePostsStore');
var Post = require('./Post');
var PostGrid = require('./PostGrid');
var LoadMoreButton = require('../Common/LoadMoreButton');

var {
  View,
  Text,
  StyleSheet,
  AppRegistry,
  ScrollView,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2F2F2'
  },
  pullDownToRefreshText: {
    alignSelf: 'center',
    marginTop: -20,
    color: 'gray'
  }
});

var PostList = React.createClass({

  propTypes: {
    posts: React.PropTypes.object.isRequired,
    onScroll: React.PropTypes.func,
    onLoadMorePostsPress: React.PropTypes.func.isRequired,
    isNextPageLoading: React.PropTypes.bool.isRequired,
    noMorePostsToFetch: React.PropTypes.bool.isRequired,
    refreshable: React.PropTypes.bool,
    isFeedRefreshing: React.PropTypes.bool,
    viewerIsPostOwner: React.PropTypes.bool,
    renderedFromProfileView: React.PropTypes.bool,
    gridViewEnabled: React.PropTypes.bool,
    likePhotoAction: React.PropTypes.func.isRequired,
    unlikePhotoAction: React.PropTypes.func.isRequired,
    onSubmitCommentAction: React.PropTypes.func.isRequired,
    loadMoreButtonStyle: React.PropTypes.object,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    var contentOffset = null,
        scrollToTopOfPostFeed = homePostsStore.scrollToTopOfPostFeed(),
        feedContainerStyles = [styles.container];

    if (this.props.refreshable && this.props.isFeedRefreshing) {
      feedContainerStyles.push({ opacity: .5 });
    }

    if (scrollToTopOfPostFeed) {
      contentOffset = {x:0,y:0};
      homePostsStore.setScrollToTopOfPostFeed(false);
    }

    return (
      <ScrollView
        style={feedContainerStyles}
        onScroll={this.props.onScroll ? this.props.onScroll : ()=>null}
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
        <PostGrid {...this.props}/>
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
          {...this.props}
          post={post}
          key={i}/>
      );
    }
    return posts;
  },

  _renderLoadMorePostsButton: function() {
    return (
        <LoadMoreButton
          style={this.props.loadMoreButtonStyle}
          onPress={this.props.onLoadMorePostsPress}
          isLoading={this.props.isNextPageLoading}
          isVisible={!this.props.noMorePostsToFetch}/>
    );
  }

});

module.exports = PostList;
