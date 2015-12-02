'use strict';

var React = require('react-native');
var Unicycle = require('./Unicycle');
var postStore = require('./stores/PostStore');
var feedSelectorStore = require('./stores/FeedSelectorStore');
var userLoginMetadataStore = require('./stores/UserLoginMetadataStore');
var MainScreenBanner = require('./MainScreenBanner');
var Post = require('./Components/Post/Post');
var FeedSelector = require('./Components/Feed/FeedSelector');
var LoadMorePostsButton = require('./Components/Post/LoadMorePostsButton');

var {
  View,
  Text,
  StyleSheet,
  AppRegistry,
  ScrollView,
  ActivityIndicatorIOS
} = React

var styles = StyleSheet.create({
  homePageContainer: {
    flex: 1
  },
  feedContainer: {
    flex: 20,
    marginTop: 10,
    paddingBottom: 50
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

var HomePage = React.createClass({

  mixins: [
    Unicycle.listenTo(postStore),
    Unicycle.listenTo(userLoginMetadataStore)
  ],

  render: function() {
    var loadingPosts = postStore.isRequestInFlight(),
        content;

    if (loadingPosts) {
      content = this.renderLoadingSpinner();
    }
    else {
      content = this.renderPosts();
    }

    return (
      <View style={styles.homePageContainer}>
        <MainScreenBanner
          title='SUNY Albany'
          subTitle='The most recent activity from your campus'/>
        <FeedSelector/>
        <View style={styles.feedContainer}>
          { content }
        </View>
      </View>
    );
  },

  renderPosts: function() {
    var postsJson = postStore.getPosts();
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
              key={post.id} />
      );
    }
    return (
      <ScrollView>

        {posts}
        <LoadMorePostsButton
          onLoadMorePostsPress={this.onLoadMorePostsPress}
          loadMorePostsRequestInFlight={postStore.isLoadMorePostsRequestInFlight()}/>

      </ScrollView>
    );
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
    var userId = userLoginMetadataStore.getUserId(),
        currentFeed = feedSelectorStore.getCurrentFeed();

    if (currentFeed == feedSelectorStore.FeedType().FULL) {
      Unicycle.exec('requestExploreFeed', userId);
    }
    else {
      Unicycle.exec('requestHomeFeed', userId);
    }
  }

});

module.exports = HomePage;
