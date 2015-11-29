'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var profileStore = require('../../stores/ProfileStore');
var Post = require('../../Components/Post/Post');

var {
  View,
  Text,
  StyleSheet,
  ActivityIndicatorIOS
} = React

var styles = StyleSheet.create({
  postsContainer: {
    flex: 1,
    padding: 5,
    paddingBottom: 50
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  userPostsHeader: {
    textAlign: 'center',
    fontSize: 20,
    padding: 10
  }
});

var UserPosts = React.createClass({

  propTypes: {
    userName: React.PropTypes.string.isRequired,
    userEmail: React.PropTypes.string.isRequired,
    viewerIsPostOwner: React.PropTypes.bool
  },

  mixins: [
    Unicycle.listenTo(profileStore)
  ],

  componentDidMount: function() {
    Unicycle.exec('getUserPosts', this.props.userEmail);
  },

  render: function() {
    var loadingPosts = profileStore.isUserPostsRequestInFlight();
    var content;
    if (loadingPosts) {
      content = this.renderLoadingSpinner()
    }
    else {
      content = this.renderPosts()
    }

    return (
      <View style={styles.postsContainer}>
        {content}
      </View>
    );
  },

  renderPosts: function() {
    var postsJson = profileStore.getPosts();
    var posts = [];
    for (var i = 0; i<postsJson.size; i++) {
      var post = postsJson.get(i);
      posts.push(
        <Post id={post.get('id')}
              posterProfileImageUrl={post.get('posterProfileImageUrl')}
              posterName={post.get('posterName')}
              timestamp={post.get('timestamp')}
              photoUrl={post.get('photoUrl')}
              numLikes={post.get('numLikes')}
              caption={post.get('caption')}
              postIdString={post.get('postIdString')}
              liked={post.get('liked')}
              key={post.get('id')}
              viewerIsPostOwner={this.props.viewerIsPostOwner} />
      );
    }
    return (
      <View>
        <Text style={styles.userPostsHeader}>
          {this.props.userName + "'s posts"}
        </Text>
        {posts}
      </View>
    );
  },

  renderLoadingSpinner: function() {
    return (
      <View style={styles.spinnerContainer}>
        <ActivityIndicatorIOS
          size='small'
          color='black'
          animating={true}
          style={styles.spinner} />
        <Text>Loading posts...</Text>
      </View>
    );
  }

});

module.exports = UserPosts;
