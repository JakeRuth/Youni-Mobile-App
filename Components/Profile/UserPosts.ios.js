'use strict';

var React = require('react-native');
var Spinner = require('../Common/Spinner');

var {
  View,
  Text,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  postsContainer: {
    flex: 1,
    paddingBottom: 50,
    backgroundColor: '#F2F2F2'
  },
  spinnerContainer: {
    alignSelf: 'center',
    backgroundColor: 'white'
  },
  noPostsMessageContainer: {
    flex: 1,
    alignItems: 'center'
  },
  noPostsMessage: {
    paddingTop: 50,
    color: '#4C4C4C',
    fontSize: 12
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
    navigator: React.PropTypes.object.isRequired,
    likePhotoAction: React.PropTypes.func,
    unlikePhotoAction: React.PropTypes.func,
    submitCommentAction: React.PropTypes.func
  },

  // Lazy load to resolve circular dependency
  getPostList: function() {
    return require('../../Components/Post/PostList');
  },

  render: function() {
    var content, style;
    var PostList = this.getPostList();

    if (this.props.loading) {
      style = styles.spinnerContainer;
      content = (
        <View style={styles.spinnerContainer}>
          <Spinner/>
        </View>
      );
    }
    else if (this.props.posts.size) {
      style = styles.postsContainer;
      content = (
        <PostList
          refreshable={this.props.viewerIsProfileOwner}
          isFeedRefreshing={this.props.profileStore.isFeedRefreshing()}
          postStore={this.props.profileStore}
          posts={this.props.posts}
          onScroll={() => { /* do nothing */ }}
          onLoadMorePostsPress={this.props.onLoadMorePostsPress}
          isLoadMorePostsRequestInFlight={this.props.isNextPageLoading}
          noMorePostsToFetch={this.props.noMorePostsToFetch}
          viewerIsPostOwner={this.props.viewerIsProfileOwner}
          renderedFromProfileView={true}
          navigator={this.props.navigator}
          likePhotoAction={this.props.likePhotoAction}
          unlikePhotoAction={this.props.unlikePhotoAction}
          submitCommentAction={this.props.submitCommentAction}/>
      );
    }
    else {
      content = this._renderNoPostsMessage();
    }

    return (
      <View style={style}>
        {content}
      </View>
    );
  },

  _renderNoPostsMessage: function() {
    return (
      <View style={styles.noPostsMessageContainer}>
        <Text style={styles.noPostsMessage}>
          No posts... yet!
        </Text>
      </View>
    );
  }

});

module.exports = UserPosts;
