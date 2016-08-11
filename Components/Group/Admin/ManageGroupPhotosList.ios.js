'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');

var PostGridThumbnail = require('../../Post/PostGridThumbnail');
var LoadMoreButton = require('../../Common/LoadMoreButton');

var manageGroupPhotosStore = require('../../../stores/group/ManageGroupPhotosStore');

var {
  View,
  ScrollView,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  postRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  selectedIcon: {
    backgroundColor: 'transparent',
    position: 'absolute',
    right: 3,
    bottom: 0
  }
});

var ManageGroupPhotosList = React.createClass({

  propTypes: {
    posts: React.PropTypes.array.isRequired,
    onLoadMorePostsPress: React.PropTypes.func.isRequired,
    noMorePostsToFetch: React.PropTypes.bool.isRequired,
    isNextPageLoading: React.PropTypes.bool.isRequired
  },

  render: function() {
    var postsJson = this.props.posts,
        posts = [];

    for (var i = 0; i<postsJson.length; i+=3) {
      posts.push(
        this._renderPostRow(postsJson[i], postsJson[i + 1], postsJson[i + 2], i)
      );
    }

    return (
      <ScrollView automaticallyAdjustContentInsets={false}>
        {posts}
        <LoadMoreButton
          onPress={this.props.onLoadMorePostsPress}
          isLoading={this.props.isNextPageLoading}
          isVisible={!this.props.noMorePostsToFetch}/>
      </ScrollView>
    );
  },

  _renderPostRow: function(leftPostJson, middlePostJson, rightPostJson, index) {
    return (
      <View
        style={styles.postRow}
        key={index}>
        {this._renderPost(leftPostJson)}
        {this._renderPost(middlePostJson)}
        {this._renderPost(rightPostJson)}
      </View>
    );
  },
  
  _renderPost: function(post) {
    if (post) {
      return (
        <View>
          <PostGridThumbnail
            post={post}
            onPress={() => manageGroupPhotosStore.togglePostInList(post)}/>
          {this._renderSelectedPostIcon(post)}
        </View>
      );
    }
  },

  _renderSelectedPostIcon: function(post) {
    if (manageGroupPhotosStore.isPostIdSelected(post.postIdString)) {
      return (
        <Icon
          style={styles.selectedIcon}
          name='ios-checkmark'
          size={22}
          color="white"/>
      );
    }
  }

});

module.exports = ManageGroupPhotosList;
