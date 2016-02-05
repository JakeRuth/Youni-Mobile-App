'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var PostList = require('../../Components/Post/PostList');
var Spinner = require('../Common/Spinner');

var {
  View,
  Text,
  StyleSheet
} = React

var styles = StyleSheet.create({
  postsContainer: {
    flex: 1,
    paddingBottom: 50
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
      content = (
        <Spinner/>
      );
    }
    else {
      content = (
        <PostList
          refreshable={this.props.viewerIsProfileOwner}
          postStore={this.props.profileStore}
          posts={this.props.profileStore.getPosts()}
          onScroll={() => { /* do nothing */ }}
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
