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
    postStore: React.PropTypes.any.isRequired,
    viewerIsPostOwner: React.PropTypes.bool
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
    for (var i = 0; i<postsJson.size; i+=2) {
      posts.push(
        this._renderPostRow(postsJson.get(i), postsJson.get(i + 1))
      );
    }
    return posts;
  },

  _renderPostRow: function(leftPost, rightPost) {
    return (
      <View style={styles.postRow}>
        <PostGridThumbnail post={leftPost}/>
        <PostGridThumbnail post={rightPost}/>
      </View>
    );
  }

});

module.exports = PostGrid;
