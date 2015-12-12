'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var Post = require('../../Components/Post/Post');
var LoadMorePostsButton = require('../Post/LoadMorePostsButton');

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
    profileStore: React.PropTypes.any.isRequired,
    userName: React.PropTypes.string.isRequired,
    userEmail: React.PropTypes.string.isRequired,
    viewerIsPostOwner: React.PropTypes.bool
  },

  componentDidMount: function() {
    this._getInitialPageOfPosts();
  },

  render: function() {
    var loadingPosts = this.props.profileStore.isUserPostsRequestInFlight(),
        content;

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
    var postsJson = this.props.profileStore.getPosts(),
        posts = [];

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
              viewerIsPostOwner={this.props.viewerIsPostOwner}
              renderedFromProfileView={true} />
      );
    }
    return (
      <View>

        <Text style={styles.userPostsHeader}>
          {this.props.userName + "'s posts"}
        </Text>
        {posts}
        {this.renderLoadMorePostsButton()}

      </View>
    );
  },

  renderLoadMorePostsButton: function() {
    if (!this.props.profileStore.getNoMorePostsToFetch()) {
      return (
          <LoadMorePostsButton
            onLoadMorePostsPress={this.onLoadMorePostsPress}
            loadMorePostsRequestInFlight={this.props.profileStore.isLoadMorePostsRequestInFlight()}/>
      );
    }
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
  },

  onLoadMorePostsPress: function() {
    var userId = userLoginMetadataStore.getUserId(),
        getUsersPostsActionName = this._getLoadUserPostsActionName(this.props.viewerIsPostOwner);

    Unicycle.exec(getUsersPostsActionName, this.props.userEmail, userId);
  },

  _getInitialPageOfPosts: function() {
    var userId = userLoginMetadataStore.getUserId(),
        getUsersPostsActionName = this._getLoadUserPostsActionName(this.props.viewerIsPostOwner);

    if (!this.props.profileStore.isUserPostsRequestInFlight()) {
      Unicycle.exec(getUsersPostsActionName, this.props.userEmail, userId);
    }
  },

  _getLoadUserPostsActionName: function(isOwner) {
    if (isOwner) {
      return 'getOwnerUserPosts';
    }
    else {
      return 'getUserPosts';
    }
  }

});

module.exports = UserPosts;
