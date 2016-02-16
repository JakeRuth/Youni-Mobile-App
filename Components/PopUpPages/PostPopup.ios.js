'use strict';

var React = require('react-native');
var Post = require('../Post/Post');
var OverlayPage = require('../Common/OverlayPage');
var explorePostsStore = require('../../stores/post/ExplorePostsStore');

var {
  View
} = React;

var PostPopup = React.createClass({

  propTypes: {
    post: React.PropTypes.object.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function () {
    return (
      <OverlayPage
        content={this._renderPost(this.props.post)}
        onBackArrowPress={() => {this.props.navigator.pop();}}/>
    );
  },

  _renderPost: function (selectedPost) {
    return (
      <Post
        postStore={explorePostsStore}
        post={selectedPost}
        navigator={this.props.navigator}/>
    );
  }

});

module.exports = PostPopup;
