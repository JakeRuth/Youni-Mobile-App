'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var homePostsStore = require('../../stores/post/HomePostsStore');
var Post = require('./Post');
var LoadMorePostsButton = require('./LoadMorePostsButton');
var Icon = require('react-native-vector-icons/Ionicons');
var Spinner = require('../Common/Spinner');

var {
  View,
  Text,
  StyleSheet,
  AppRegistry,
  ScrollView,
  TouchableHighlight
} = React

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
    viewerIsPostOwner: React.PropTypes.bool,
    renderedFromProfileView: React.PropTypes.bool
  },

  render: function() {
    var that = this,
        refreshHeader = <View/>,
        contentOffset = null,
        scrollToTopOfPostFeed = homePostsStore.scrollToTopOfPostFeed();

    if (this.props.refreshable && this.props.postStore.isFeedRefreshing()) {
      refreshHeader = <Spinner />;
    }
    else {
      refreshHeader = (
        <Text style={styles.pullDownToRefreshText}>Pull down to refresh</Text>
      );
    }

    if (scrollToTopOfPostFeed) {
      contentOffset = {x:0,y:0};
      homePostsStore.setScrollToTopOfPostFeed(false);
    }

    return (
      <ScrollView
        style={styles.container}
        onScroll={this.props.onScroll}
        contentOffset={contentOffset}>

        {refreshHeader}

        {this._renderPosts()}
        {this._renderLoadMorePostsButton()}

      </ScrollView>
    );
  },

  _renderPosts: function() {
    var postsJson = this.props.posts;
    var posts = [];
    for (var i = 0; i<postsJson.size; i++) {
      var post = postsJson.get(i);
      posts.push(
        <Post id={post.id}
              postIdString={post.postIdString}
              posterProfileImageUrl={post.posterProfileImageUrl}
              posterEmail={post.posterEmail}
              posterName={post.posterName}
              timestamp={post.timestamp}
              photoUrl={post.photoUrl}
              numLikes={post.numLikes}
              firstComments={post.firstComments}
              moreCommentsToShow={post.moreComments}
              numComments={post.numComments}
              caption={post.caption}
              liked={post.liked}
              key={post.id}
              postStore={this.props.postStore}
              renderedFromProfileView={this.props.renderedFromProfileView}
              viewerIsPostOwner={this.props.viewerIsPostOwner}/>
      );
    }
    return posts;
  },

  _renderLoadMorePostsButton: function() {
    if (!this.props.postStore.getNoMorePostsToFetch()) {
      return (
          <LoadMorePostsButton
            onLoadMorePostsPress={this.props.onLoadMorePostsPress}
            loadMorePostsRequestInFlight={this.props.isLoadMorePostsRequestInFlight}/>
      );
    }
  },

  _renderManualRefreshButton: function() {
    return (
      <TouchableHighlight
        style={styles.refreshIconContainer}
        underlayColor='transparent'
        onPress={this.props.onManualRefreshButtonPress}>
        <Icon
          name='refresh'
          size={35}
          color={'gray'} />
      </TouchableHighlight>
    );
  },

});

module.exports = PostList;
