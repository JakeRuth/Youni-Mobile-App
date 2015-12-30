'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var Post = require('./Post');
var LoadMorePostsButton = require('./LoadMorePostsButton');

var {
  View,
  Text,
  StyleSheet,
  AppRegistry,
  ScrollView,
  ActivityIndicatorIOS
} = React

var styles = StyleSheet.create({
  pullDownToRefreshText: {
    alignSelf: 'center',
    marginTop: -20,
    color: 'gray'
  },
  spinnerContainer: {
    height: 40,
    justifyContent: 'center',
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
    var refreshHeader;

    if (this.props.refreshable && this.props.postStore.isFeedRefreshing()) {
      refreshHeader = this._renderRefreshingSpinner();
    }
    else {
      refreshHeader = (
        <Text style={styles.pullDownToRefreshText}>Pull down to refresh</Text>
      );
    }

    return (
      <ScrollView onScroll={this.props.onScroll}>

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
              posterProfileImageUrl={post.posterProfileImageUrl}
              posterEmail={post.posterEmail}
              posterName={post.posterName}
              timestamp={post.timestamp}
              photoUrl={post.photoUrl}
              numLikes={post.numLikes}
              caption={post.caption}
              postIdString={post.postIdString}
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

  _renderRefreshingSpinner: function() {
    return (
      <View style={styles.spinnerContainer}>
        <ActivityIndicatorIOS
          size="small"
          color="black"
          animating={true}/>
      </View>
    );
  },

});

module.exports = PostList;
