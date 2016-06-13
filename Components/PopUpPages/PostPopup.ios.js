'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var Post = require('../Post/Post');
var OverlayPage = require('../Common/OverlayPage');
var explorePostsStore = require('../../stores/post/ExplorePostsStore');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var PostUtils = require('../../Utils/Post/PostUtils');

var {
  View
} = React;

var PostPopup = React.createClass({

  propTypes: {
    post: React.PropTypes.object.isRequired,
    clickedFromExploreFeed: React.PropTypes.bool,
    navigator: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      post: this.props.post // post can change if it get's liked or commented on
    };
  },

  mixins: [
    Unicycle.listenTo(explorePostsStore)
  ],

  render: function () {
    return (
      <OverlayPage
        content={this._renderPost(this.props.post)}
        onBackArrowPress={() => {this.props.navigator.pop();}}
        bumpContentUpWhenKeyboardShows={true}/>
    );
  },

  _renderPost: function (post) {
    if (this.props.clickedFromExploreFeed) {
      return (
        <Post
          postStore={explorePostsStore}
          post={post}
          onSubmitCommentCallback={this._onSubmitCommentCallback}
          navigator={this.props.navigator}/>
      );
    }
    else {
      return (
        <Post
          postStore={explorePostsStore /* TODO: Make it so that we don't have to pass this in */}
          post={post}
          likePhotoAction={this._likePhotoAction}
          unlikePhotoAction={this._unlikePhotoAction}
          onSubmitCommentCallback={this._onSubmitCommentCallback}
          navigator={this.props.navigator}/>
      );
    }
  },

  _likePhotoAction(postIndex, postId, userId, callback) {
    var post = this.state.post;
    
    // optimistically like the post
    this.setState({
      post: PostUtils.likePost(post)
    });
    
    AjaxUtils.ajax(
      '/post/like',
      {
        postIdString: postId,
        userIdString: userId
      },
      (res) => {
        callback();
      },
      () => {
        callback();
      }
    );
  },

  _unlikePhotoAction(postIndex, postId, userId, callback) {
    var post = this.state.post;

    // optimistically unlike the post
    this.setState({
      post: PostUtils.unlikePost(post)
    });

    AjaxUtils.ajax(
      '/post/removeLike',
      {
        postIdString: postId,
        userIdString: userId
      },
      (res) => {
        callback();
      },
      () => {
        callback();
      }
    );
  },

  _onSubmitCommentCallback: function(post, comment, commenterName) {
    PostUtils.addComment(post, comment, commenterName);
  }

});

module.exports = PostPopup;
