'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var PostList = require('../../Components/Post/PostList');

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
  }
});

var UserPosts = React.createClass({

  propTypes: {
    profileStore: React.PropTypes.any.isRequired,
    userName: React.PropTypes.string.isRequired,
    userEmail: React.PropTypes.string.isRequired,
    viewerIsProfileOwner: React.PropTypes.bool
  },

  componentDidMount: function() {
    this._getInitialPageOfPosts();
  },

  render: function() {
    var loadingPosts = this.props.profileStore.isUserPostsRequestInFlight(),
        content;

    if (loadingPosts) {
      content = this.renderLoadingSpinner();
    }
    else {
      content = (
        <PostList
          refreshable={this.props.viewerIsProfileOwner}
          postStore={this.props.profileStore}
          posts={this.props.profileStore.getPosts()}
          onScroll={this.handleScroll}
          onLoadMorePostsPress={this.onLoadMorePostsPress}
          isLoadMorePostsRequestInFlight={this.props.profileStore.isLoadMorePostsRequestInFlight()}
          viewerIsPostOwner={this.props.viewerIsProfileOwner}
          renderedFromProfileView={true}/>
      );
    }

    return (
      <View style={styles.postsContainer}>
        {content}
      </View>
    );
  },

  handleScroll(e) {
    var infiniteScrollThreshold = -1,
        userId = userLoginMetadataStore.getUserId();

    if (e.nativeEvent.contentOffset.y < infiniteScrollThreshold) {

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
        getUsersPostsActionName = this._getLoadUserPostsActionName(this.props.viewerIsProfileOwner);

    Unicycle.exec(getUsersPostsActionName, this.props.userEmail, userId);
  },

  _getInitialPageOfPosts: function() {
    var userId = userLoginMetadataStore.getUserId(),
        getUsersPostsActionName = this._getLoadUserPostsActionName(this.props.viewerIsProfileOwner);

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
