'use strict';

var React = require('react');
var ReactNative = require('react-native');
var PostGridThumbnail = require('./PostGridThumbnail');

var {
  View,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  postRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

var PostGrid = React.createClass({

  propTypes: {
    posts: React.PropTypes.object.isRequired,
    likePhotoAction: React.PropTypes.func.isRequired,
    unlikePhotoAction: React.PropTypes.func.isRequired,
    onSubmitCommentAction: React.PropTypes.func.isRequired,
    onDeleteCommentAction: React.PropTypes.func.isRequired,
    viewerIsPostOwner: React.PropTypes.bool,
    renderedFromProfileView: React.PropTypes.bool,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    var postsJson = this.props.posts,
        posts = [];
    
    for (var i = 0; i<postsJson.size; i+=3) {
      posts.push(
        this._renderPostRow(postsJson.get(i), postsJson.get(i + 1), postsJson.get(i + 2), i)
      );
    }
    
    return (
      <View>
        {posts}
      </View>
    );
  },

  _renderPostRow: function(leftPostJson, middlePostJson, rightPostJson, index) {
    var leftPost, middlePost, rightPost;

    if (leftPostJson) {
      leftPost = (
        <PostGridThumbnail
          {...this.props}
          post={leftPostJson}/>
      );
    }
    if (middlePostJson) {
      middlePost = (
        <PostGridThumbnail
          {...this.props}
          post={middlePostJson}/>
      );
    }
    if (rightPostJson) {
      rightPost = (
        <PostGridThumbnail
          {...this.props}
          post={rightPostJson}/>
      );
    }

    return (
      <View
        style={styles.postRow}
        key={index}>
        {leftPost}
        {middlePost}
        {rightPost}
      </View>
    );
  }

});

module.exports = PostGrid;
