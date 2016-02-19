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
} = React;

var styles = StyleSheet.create({
  postsContainer: {
    flex: 1,
    paddingBottom: 50
  }
});

var UserPosts = React.createClass({

  propTypes: {
    posts: React.PropTypes.object.isRequired,
    profileStore: React.PropTypes.any.isRequired,
    onLoadMorePostsPress: React.PropTypes.func.isRequired,
    noMorePostsToFetch: React.PropTypes.bool.isRequired,
    viewerIsProfileOwner: React.PropTypes.bool,
    loading: React.PropTypes.bool,
    isNextPageLoading: React.PropTypes.bool,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    var content;

    if (this.props.loading) {
      content = (
        <Spinner/>
      );
    }
    else {
      content = (
        <PostList
          refreshable={this.props.viewerIsProfileOwner}
          isFeedRefreshing={this.props.profileStore.isFeedRefreshing()}//TODO
          noMorePostsToFetch={false}//TODO
          postStore={this.props.profileStore}
          posts={this.props.posts}
          onScroll={() => { /* do nothing */ }}
          onLoadMorePostsPress={this.props.onLoadMorePostsPress}
          isLoadMorePostsRequestInFlight={this.props.isNextPageLoading}
          noMorePostsToFetch={this.props.noMorePostsToFetch}
          viewerIsPostOwner={this.props.viewerIsProfileOwner}
          renderedFromProfileView={true}
          navigator={this.props.navigator}/>
      );
    }

    return (
      <View style={styles.postsContainer}>
        {content}
      </View>
    );
  }

});

module.exports = UserPosts;
