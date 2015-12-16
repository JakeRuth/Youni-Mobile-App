'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var homePostsStore = require('../../stores/post/HomePostsStore');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var Post = require('./Post');
var LoadMorePostsButton = require('./LoadMorePostsButton');

var {
  View,
  Text,
  StyleSheet,
  AppRegistry,
  ScrollView
} = React

var styles = StyleSheet.create({
  pullDownToRefreshText: {
    alignSelf: 'center',
    marginTop: -20,
    color: 'gray'
  }
});

var PostList = React.createClass({

  propTypes: {
    posts: React.PropTypes.object.isRequired,
    onScroll: React.PropTypes.func.isRequired,
    onLoadMorePostsPress: React.PropTypes.func.isRequired,
    isLoadMorePostsRequestInFlight: React.PropTypes.bool
  },

  render: function() {
    var postsJson = this.props.posts;
    var posts = [];
    for (var i = 0; i<postsJson.size; i++) {
      var post = postsJson.get(i);
      posts.push(
        <Post id={post.id}
              posterProfileImageUrl={post.posterProfileImageUrl}
              posterName={post.posterName}
              timestamp={post.timestamp}
              photoUrl={post.photoUrl}
              numLikes={post.numLikes}
              caption={post.caption}
              postIdString={post.postIdString}
              liked={post.liked}
              key={post.id}
              postStore={homePostsStore} />
      );
    }
    return (
      <ScrollView onScroll={this.props.onScroll}>

        <Text style={styles.pullDownToRefreshText}>Pull down to refresh</Text>
        {posts}
        {this.renderLoadMorePostsButton()}

      </ScrollView>
    );
  },

  renderLoadMorePostsButton: function() {
    if (!homePostsStore.getNoMorePostsToFetch()) {
      return (
          <LoadMorePostsButton
            onLoadMorePostsPress={this.props.onLoadMorePostsPress}
            loadMorePostsRequestInFlight={this.props.isLoadMorePostsRequestInFlight}/>
      );
    }
  }

});

module.exports = PostList;
