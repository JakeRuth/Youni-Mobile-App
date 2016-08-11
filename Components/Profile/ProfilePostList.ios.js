'use strict';

var React = require('react');
var ReactNative = require('react-native');
var NoPostsMessage = require('../Profile/NoPostsMessage');
var Spinner = require('../Common/Spinner');

var {
  View,
  Text,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  postsContainer: {
    flex: 1,
    paddingBottom: 50
  },
  spinnerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10
  }
});

var ProfilePostList = React.createClass({

  propTypes: {
    posts: React.PropTypes.object.isRequired,
    user: React.PropTypes.object.isRequired,
    gridViewEnabled: React.PropTypes.bool,
    onLoadMorePostsPress: React.PropTypes.func.isRequired,
    noMorePostsToFetch: React.PropTypes.bool.isRequired,
    viewerIsProfileOwner: React.PropTypes.bool,
    loading: React.PropTypes.bool,
    isNextPageLoading: React.PropTypes.bool.isRequired,
    navigator: React.PropTypes.object.isRequired,
    likePhotoAction: React.PropTypes.func.isRequired,
    unlikePhotoAction: React.PropTypes.func.isRequired,
    onSubmitCommentAction: React.PropTypes.func.isRequired
  },

  // Lazy load to resolve circular dependency
  getPostList: function() {
    return require('../../Components/Post/PostList');
  },

  render: function() {
    var PostList = this.getPostList();

    if (this.props.loading) {
      return (
        <View style={styles.spinnerContainer}>
          <Spinner/>
        </View>
      );
    }
    else if (this.props.posts.size) {
      return (
        <View style={styles.postsContainer}>
          <PostList
            {...this.props}
            renderedFromProfileView={true}/>
        </View>
      );
    }
    else {
      return (
        <NoPostsMessage {...this.props}/>
      );
    }
  }

});

module.exports = ProfilePostList;
