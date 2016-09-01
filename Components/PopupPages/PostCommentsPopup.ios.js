'use strict';

var React = require('react');

var OverlayPage = require('../Common/OverlayPage');
var PostCommentsPage = require('../Post/PostCommentsPage');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var PostUtils = require('../../Utils/Post/PostUtils');
var CommentInput = require('../Post/Footer/CommentInput');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var PostCommentsPopup = React.createClass({

  PAGE_SIZE: 40,

  propTypes: {
    navigator: React.PropTypes.object.isRequired,
    post: React.PropTypes.object.isRequired,
    onSubmitCommentAction: React.PropTypes.func.isRequired,
    onDeleteCommentAction: React.PropTypes.func.isRequired,
    commentInputAutoFocus: React.PropTypes.bool
  },

  getInitialState: function() {
    return {
      comments: this._buildStateCommentsJson(this.props.post.firstComments),
      isLoading: false,
      moreToFetch: false,
      offset: this.props.post.firstComments.length
    };
  },

  componentDidMount() {
    if (this.props.post.numComments > PostUtils.DEFAULT_MAX_COMMENTS_VISIBLE) {
      this.fetchComments();
    }
  },

  render: function() {
    var pageContent = (
      <PostCommentsPage
        {...this.props}
        loading={this.state.loading}
        comments={this._getComments()}
        moreToFetch={this.state.moreToFetch}
        onLoadMorePress={this.fetchComments}
        onDeleteCommentAction={this.onDeleteComment}
        onSubmitCommentCallback={this.onSubmitCommentCallback}/>
    );

    return (
      <OverlayPage
        content={pageContent}
        onBackArrowPress={() => {
          this.props.navigator.pop();
        }}
        bannerTitle='Comments'
        isKeyboardVisible={this.props.commentInputAutoFocus}
        keyboardShouldPersistTaps={true}/>
    );
  },

  onSubmitCommentCallback: function(commentText, id) {
    var currentComments = this._getComments(),
        commenterName = userLoginMetadataStore.getFullName(),
        commenterEmail = userLoginMetadataStore.getEmail(),
        commenterProfilePictureUrl = userLoginMetadataStore.getProfileImageUrl();

    currentComments.push({
      id: id,
      comment: commentText,
      commenterName: commenterName,
      commenterEmail: commenterEmail,
      commenterProfilePicture: commenterProfilePictureUrl,
      generatedFromPostCommentsPopupComponent: true
    });

    this.setState({
      comments: currentComments
    });
  },

  onDeleteComment: function(comment, post, callback) {
    this.props.onDeleteCommentAction(comment, post, () => {
      var comments = this._getComments(),
          indexOfCommentToRemove;

      for (var i = 0; i < comments.length; i++) {
        if (comments[i].id === comment.id) {
          indexOfCommentToRemove = i;
          break;
        }
      }

      if (indexOfCommentToRemove === 0) {
        comments.shift();
      }
      else {
        comments.splice(indexOfCommentToRemove, 1);
      }

      this.setState({
        comments: comments
      });
      callback();
    });
  },

  fetchComments: function() {
    var that = this,
        currentComments = this.state.comments;

    this.setState({
      loading: true
    });

    AjaxUtils.ajax(
      '/post/fetchComments',
      {
        postIdString: that.props.post.postIdString,
        fetchOffsetAmount: that.state.offset,
        maxToFetch: that.PAGE_SIZE
      },
      (res) => {
        that.setState({
          loading: false,
          comments: currentComments.concat(that._buildStateCommentsJson(res.body.comments.reverse())),
          moreToFetch: res.body.moreToFetch,
          offset: that.state.offset + that.PAGE_SIZE
        });
      },
      () => {
        that.setState({
          loading: false
        });
      }
    );
  },

  _getComments: function() {
    let comments = [];
    for (let i = 0; i < this.state.comments.length; i++) {
      let comment = this.state.comments[i];
      if (comment.generatedFromPostCommentsPopupComponent) {
        comments.push(comment);
      }
    }
    return comments;
  },

  _buildStateCommentsJson: function(comments) {
    let newComments = [];
    for (let i = 0; i < comments.length; i++) {
      newComments.push(this._addHackyFieldToComment(comments[i]));
    }
    return newComments;
  },

  /*
   *
   * Note from Jake (I am so infuriated right now)
   *
   * So, there is a bug where *sometimes* we will see a duplicate comment, when only one was posted
   * This is purely a UI bug, the server only records one comment
   *
   * This bug always happens when there are no comments on a post, however sometimes it happens when there is already
   * one comment or more than one comment on the post.
   *
   * I spent well over an hour debugging line for line and I could not figure out why this was happening, but here is what I found out:
   * - By the time onSubmitCommentCallback is called, there is already the new comment in this components comment state
   * -- seriously how the fuck did it get there....
   * - The component that renders this component was not re called
   * - the getInitialState wasn't called again (as expected)
   * - somehow the state of this component is being updated and getting the new comment, but lord knows how that is happening
   * - aaand this only happens sometimes, I can't find a good pattern.
   *
   *
   * And that hopefully explains why I needed to cut my losses and make this dumb ass function.
   *
   */
  _addHackyFieldToComment: function(comment) {
    comment.generatedFromPostCommentsPopupComponent = true;
    return comment
  }

});

module.exports = PostCommentsPopup;
