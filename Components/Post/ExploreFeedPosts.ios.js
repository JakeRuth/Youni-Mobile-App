'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var explorePostsStore = require('../../stores/post/ExplorePostsStore');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var Post = require('./Post');
var LoadMorePostsButton = require('./LoadMorePostsButton');

var {
  View,
  Text,
  StyleSheet,
  ScrollView,
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
      content = this.renderPosts();
    }

    return (
      <View style={styles.exploreFeedContainer}>
        {content}
      </View>
    );
  },

  renderPosts: function() {
    var postsJson = explorePostsStore.getPosts();
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
              postStore={explorePostsStore} />
      );
    }
    return (
      <ScrollView>

        {posts}
        {this.renderLoadMorePostsButton()}

      </ScrollView>
    );
  },

  renderLoadMorePostsButton: function() {
    if (!explorePostsStore.getNoMorePostsToFetch()) {
      return (
          <LoadMorePostsButton
            onLoadMorePostsPress={this.onLoadMorePostsPress}
            loadMorePostsRequestInFlight={explorePostsStore.isLoadMorePostsRequestInFlight()}/>
      );
    }
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

  onLoadMorePostsPress: function() {
    var userId = userLoginMetadataStore.getUserId();
    Unicycle.exec('requestExploreFeed', userId);
  }

});

module.exports = ExploreFeedPosts;
