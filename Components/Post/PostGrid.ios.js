'use strict';

var React = require('react-native');
var PostGridThumbnail = require('./PostGridThumbnail');

var {
  View,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  postRow: {
    flex: 1,
    flexDirection: 'row'
  }
});

var PostGrid = React.createClass({

  propTypes: {
    posts: React.PropTypes.object.isRequired,
    viewerIsPostOwner: React.PropTypes.bool,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    return (
      <View>
        {this._renderPosts()}
      </View>
    );
  },

  _renderPosts: function() {
    var postsJson = this.props.posts;
    var posts = [];
    for (var i = 0; i<postsJson.size; i+=3) {
      posts.push(
        this._renderPostRow(postsJson.get(i), postsJson.get(i + 1), postsJson.get(i + 2), i)
      );
    }
    return posts;
  },

  _renderPostRow: function(leftPostJson, middlePostJson, rightPostJson, index) {
    var leftPost, middlePost, rightPost;

    leftPost = (
      <PostGridThumbnail
        post={leftPostJson}
        navigator={this.props.navigator}/>
    );

    middlePost = (
      <PostGridThumbnail
        post={middlePostJson}
        navigator={this.props.navigator}/>
    );

    rightPost = (
      <PostGridThumbnail
        post={rightPostJson}
        navigator={this.props.navigator}/>
      );

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
