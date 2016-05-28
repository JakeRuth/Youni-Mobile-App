'use strict';

var React = require('react-native');
var OverlayPage = require('../Common/OverlayPage');
var PostCommentsPage = require('../Post/PostCommentsPage');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var PostUtils = require('../../Utils/Post/PostUtils');
var CommentInput = require('../Post/Footer/CommentInput');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var PostCommentsPopup = React.createClass({

  PAGE_SIZE: 20,

  propTypes: {
    navigator: React.PropTypes.object.isRequired,
    post: React.PropTypes.object.isRequired,
    onSubmitCommentCallback: React.PropTypes.func.isRequired,
    commentInputAutoFocus: React.PropTypes.bool
  },

  // TODO - NOW -> think of a way to optimize to always show comments if they are passed in
  // rather than always showing the spinner
  getInitialState: function() {
    return {
      loading: true,
      comments: []//this.props.post.firstComments
    };
  },

  componentDidMount() {
    this._fetchComments();
  },

  render: function() {
    var pageContent = (
      <PostCommentsPage
        loading={this.state.loading}
        post={this.props.post}
        comments={this.state.comments}
        navigator={this.props.navigator}
        commentInputAutoFocus={this.props.commentInputAutoFocus}
        submitCommentCallback={this._submitCommentCallback}/>
    );

    return (
      <OverlayPage
        content={pageContent}
        onBackArrowPress={() => {
          this.props.navigator.pop();
        }}
        bannerTitle='Comments'
        bumpContentUpWhenKeyboardShows={true}
        isKeyboardVisible={this.props.commentInputAutoFocus}/>
    );
  },

  _submitCommentCallback: function(comment) {
    var commenterName = userLoginMetadataStore.getFullName();

    this.state.comments.push({
      comment: comment,
      commenterName: commenterName
    });

    this.props.onSubmitCommentCallback(this.props.post, comment, commenterName);
  },

  _fetchComments: function() {
    var that = this,
        currentComments = this.state.comments;

    AjaxUtils.ajax(
      '/post/getComments',
      {
        postIdString: that.props.post.postIdString,
        //fetchOffsetAmount: this.state.offsetAmount,
        //maxToFetch: that.PAGE_SIZE
      },
      (res) => {
        var comments = PostUtils.createCommentsJsonFromGreedy(res.body.comments);

        that.setState({
          loading: false,
          comments: currentComments.concat(comments)
        });
      },
      () => {
        that.setState({
          loading: false
        });
      }
    );
  }

});

module.exports = PostCommentsPopup;
