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
    for (var i = 0; i<postsJson.size; i+=2) {
      posts.push(
        this._renderPostRow(postsJson.get(i), postsJson.get(i + 1))
      );
    }
    return posts;
  },

  _renderPostRow: function(leftPostJson, rightPostJson) {
    var leftPost, rightPost;

    // it is possible for these to be blank if the total post count wasn't 10 (page size)
    // one case where this happens is when the requesting user has user's blocked and the posts are filtered
    // out of the results (so less then 10 are returned)
    if (leftPostJson) {
      leftPost = (
        <PostGridThumbnail
          post={leftPostJson}
          navigator={this.props.navigator}/>
      );
    }
    if (rightPostJson) {
      rightPost = (
        <PostGridThumbnail
          post={rightPostJson}
          navigator={this.props.navigator}/>
      );
    }

    return (
      <View style={styles.postRow}>
        {leftPost}
        {rightPost}
      </View>
    );
  }

});

module.exports = PostGrid;
