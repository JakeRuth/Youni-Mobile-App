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
    likePhotoAction: React.PropTypes.func.isRequired,
    unlikePhotoAction: React.PropTypes.func.isRequired,
    onSubmitCommentAction: React.PropTypes.func.isRequired,
    viewerIsPostOwner: React.PropTypes.bool,
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
    return (
      <View
        style={styles.postRow}
        key={index}>
        
        <PostGridThumbnail
          {...this.props}
          post={leftPostJson}/>
        <PostGridThumbnail
          {...this.props}
          post={middlePostJson}/>
        <PostGridThumbnail
          {...this.props}
          post={rightPostJson}/>
        
      </View>
    );
  }

});

module.exports = PostGrid;
