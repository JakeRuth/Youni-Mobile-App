'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var Post = require('../Post/Post');
var OverlayPage = require('../Common/OverlayPage');
var explorePostsStore = require('../../stores/post/ExplorePostsStore');
var profileOwnerStore = require('../../stores/profile/ProfileOwnerStore');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var PostUtils = require('../../Utils/Post/PostUtils');

var {
  View
} = React;

var PostPopup = React.createClass({

  propTypes: {
    post: React.PropTypes.object.isRequired,
    likePhotoAction: React.PropTypes.func,
    unlikePhotoAction: React.PropTypes.func,
    onSubmitCommentAction: React.PropTypes.func,
    renderedFromProfileView: React.PropTypes.bool,
    navigator: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      post: this.props.post // post can change if it get's liked or commented on
    };
  },

  mixins: [
    Unicycle.listenTo(explorePostsStore),
    Unicycle.listenTo(profileOwnerStore)
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
    return (
      <Post
        post={post}
        renderedFromProfileView={this.props.renderedFromProfileView}
        likePhotoAction={this.props.likePhotoAction ? this.props.likePhotoAction : this._likePhotoAction}
        unlikePhotoAction={this.props.unlikePhotoAction ? this.props.unlikePhotoAction : this._unlikePhotoAction}
        onSubmitCommentAction={this.props.onSubmitCommentAction ? this.props.onSubmitCommentAction : this._onSubmitCommentCallback}
        navigator={this.props.navigator}/>
    );
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
