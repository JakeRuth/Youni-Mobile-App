'use strict';

var React = require('react-native');
var Unicycle = require('./Unicycle');
var postStore = require('./stores/PostStore');
var userLoginMetadataStore = require('./stores/UserLoginMetadataStore');
var MainScreenBanner = require('./MainScreenBanner');
var Post = require('./Post');

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

  componentDidMount: function() {
    Unicycle.exec('requestExploreFeed');
  },

  render: function() {
    var loadingPosts = postStore.getIsRequestInFlight();
    var content;
    if (loadingPosts) {
      content = this.renderLoadingSpinner()
    }
    else {
      content = this.renderPosts()
    }

    return (
      <View style={styles.homePageContainer}>
        <MainScreenBanner
          title="SUNY Albany"
          subTitle="The most recent activity from your campus"/>
        { content }
      </View>
    );
  },

  renderPosts: function() {
    var postsJson = postStore.getPosts();
    var posts = [];
    for (var i = 0; i<postsJson.size; i++) {
      var post = postsJson.get(i);
      posts.push(
        <Post id={post.get('id')}
              posterName={post.get('posterName')}
              timestamp={post.get('timestamp')}
              photoUrl={post.get('photoUrl')}
              numLikes={post.get('numLikes')}
              caption={post.get('caption')}
              postIdString={post.get('postIdString')}
              key={post.get('id')} />
      );
    }
    return (
      <ScrollView>
        {posts}
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
  }

});

module.exports = HomePage;
