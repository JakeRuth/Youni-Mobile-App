'use strict';

var React = require('react-native');
var PostList = require('../Post/PostList');
var Spinner = require('../Common/Spinner');
var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Text,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  spinnerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  noPostsMessage: {
    paddingTop: 100,
    color: Colors.MED_GRAY,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '100'
  }
});

var GroupPostList = React.createClass({

  propTypes: {
    posts: React.PropTypes.object.isRequired,
    gridViewEnabled: React.PropTypes.bool,
    onLoadMorePostsPress: React.PropTypes.func.isRequired,
    noMorePostsToFetch: React.PropTypes.bool.isRequired,
    loading: React.PropTypes.bool,
    isNextPageLoading: React.PropTypes.bool.isRequired,
    navigator: React.PropTypes.object.isRequired,
    likePhotoAction: React.PropTypes.func.isRequired,
    unlikePhotoAction: React.PropTypes.func.isRequired,
    onSubmitCommentAction: React.PropTypes.func.isRequired
  },

  render: function() {
    if (this.props.loading) {
      return (
        <View style={styles.spinnerContainer}>
          <Spinner/>
        </View>
      );
    }
    else if (this.props.posts.size) {
      return (
        <View style={styles.container}>
          <PostList {...this.props}/>
        </View>
      );
    }
    else {
      return (
        <Text style={[styles.container, styles.noPostsMessage]}>
          No Posts Yet
        </Text>
      );
    }
  }

});

module.exports = GroupPostList;
