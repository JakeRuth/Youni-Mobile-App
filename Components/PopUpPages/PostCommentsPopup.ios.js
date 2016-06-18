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
    onSubmitCommentAction: React.PropTypes.func.isRequired,
    commentInputAutoFocus: React.PropTypes.bool
  },

  getInitialState: function() {
    return {
      comments: this.props.post.firstComments,
      isLoading: false,
      moreToFetch: true,
      offset: this.props.post.firstComments.length
    };
  },

  componentDidMount() {
    if (this.props.post.numComments > 0) {
      this.fetchComments();
    }
  },

  render: function() {
    var pageContent = (
      <PostCommentsPage
        {...this.props}
        loading={this.state.loading}
        comments={this.state.comments}
        moreToFetch={this.state.moreToFetch}
        onLoadMorePress={this.fetchComments}
        onSubmitCommentCallback={this.onSubmitCommentCallback}/>
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

  onSubmitCommentCallback: function(comment) {
    var commenterName = userLoginMetadataStore.getFullName();

    this.state.comments.push({
      comment: comment,
      commenterName: commenterName
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
        var comments = PostUtils.createCommentsJsonFromGreedy(res.body.comments);

        that.setState({
          loading: false,
          comments: currentComments.concat(comments),
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
  }

});

module.exports = PostCommentsPopup;
