'use strict';

var React = require('react-native');
var Unicycle = require('./Unicycle');
var homePostsStore = require('./stores/post/HomePostsStore');
var userLoginMetadataStore = require('./stores/UserLoginMetadataStore');
var MainScreenBanner = require('./MainScreenBanner');
var Post = require('./Components/Post/Post');
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
    Unicycle.listenTo(homePostsStore),
    Unicycle.listenTo(userLoginMetadataStore)
  ],

  componentDidMount: function() {
    var userId = userLoginMetadataStore.getUserId();
    Unicycle.exec('requestHomeFeed', userId);
  },

  render: function() {
    var loadingPosts = homePostsStore.isRequestInFlight(),
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
          title='Home Feed'
          subTitle='Posts from the people YOU care about'/>
        <View style={styles.feedContainer}>
          { content }
        </View>
      </View>
    );
  },

  renderPosts: function() {
    var postsJson = homePostsStore.getPosts();
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
      <ScrollView>

        {posts}
        {this.renderLoadMorePostsButton()}

      </ScrollView>
    );
  },

  renderLoadMorePostsButton: function() {
    if (!homePostsStore.getNoMorePostsToFetch()) {
      return (
          <LoadMorePostsButton
            onLoadMorePostsPress={this.onLoadMorePostsPress}
            loadMorePostsRequestInFlight={homePostsStore.isLoadMorePostsRequestInFlight()}/>
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
    Unicycle.exec('requestHomeFeed', userId);
  }

});

module.exports = HomePage;
