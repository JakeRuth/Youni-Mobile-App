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
      post: this.props.post, // post can change if it get's liked or commented on
      isLikeRequestInFlight: false
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
          isLikeRequestInFlight={explorePostsStore.isLikeRequestInFlight()}
          navigator={this.props.navigator}/>
      );
    }
    else {
      return (
        <Post
          postStore={explorePostsStore /* TODO: Make it so that we don't have to pass this in */}
          post={post}
          isLikeRequestInFlight={this.state.isLikeRequestInFlight}
          likePhotoAction={this._likePhotoAction}
          unlikePhotoAction={this._unlikePhotoAction}
          submitCommentAction={this._submitCommentAction}
          navigator={this.props.navigator}/>
      );
    }
  },

  _likePhotoAction(postIndex, postId, userId, callback) {
    var that = this,
        post = this.state.post;

    if (!this.state.isLikeRequestInFlight) {
      this.setState({
        isLikeRequestInFlight: true
      });

      AjaxUtils.ajax(
        '/post/like',
        {
          postIdString: postId,
          userIdString: userId
        },
        (res) => {
          that.setState({
            post: PostUtils.likePost(post),
            isLikeRequestInFlight: false
          });
          callback();
        },
        () => {
          that.setState({
            isLikeRequestInFlight: false
          });
          callback();
        }
      );
    }
  },

  _unlikePhotoAction(postIndex, postId, userId, callback) {
    var post = this.state.post,
        that = this;

    if (!this.state.isLikeRequestInFlight) {
      this.setState({
        isLikeRequestInFlight: true
      });

      AjaxUtils.ajax(
        '/post/removeLike',
        {
          postIdString: postId,
          userIdString: userId
        },
        (res) => {
          that.setState({
            post: PostUtils.unlikePost(post),
            isLikeRequestInFlight: false
          });
          callback();
        },
        () => {
          that.setState({
            isLikeRequestInFlight: false
          });
          callback();
        }
      );
    }
  },

  _submitCommentAction: function(id, postIdString, userIdString, comment, commenterName, callback) {
    var post = this.state.post,
        that = this;

    AjaxUtils.ajax(
      '/post/createComment',
      {
        postIdString: postIdString,
        userIdString: userIdString,
        comment: comment
      },
      (res) => {
        that.setState({
          post: PostUtils.addComment(post, comment, commenterName)
        });
        callback();
      },
      () => {
        callback();
      }
    );
  }

});

module.exports = PostPopup;
