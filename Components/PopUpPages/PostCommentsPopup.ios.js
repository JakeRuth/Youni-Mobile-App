'use strict';

var React = require('react-native');
var OverlayPage = require('../Common/OverlayPage');
var PostCommentsPage = require('../Post/PostCommentsPage');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var PostUtils = require('../../Utils/Post/PostUtils');
var CommentInput = require('../Post/Footer/CommentInput');

var {
  View
} = React;

var PostCommentsPopup = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired,
    post: React.PropTypes.object.isRequired,
    commentInputAutoFocus: React.PropTypes.bool
  },

  getInitialState: function() {
    return {
      loading: true
    };
  },

  componentDidMount() {
    var that = this;

    AjaxUtils.ajax(
      '/post/getComments',
      {
        postIdString: that.props.post.postIdString
      },
      (res) => {
        var comments = PostUtils.createCommentsJsonFromGreedy(res.body.comments);
        that.props.post.firstComments = comments;
        that.props.post.moreCommentsToShow = false;
        that.setState({
          loading: false
        });
      },
      () => {
        that.setState({
          loading: false
        });
      }
    );
  },

  render: function() {
    var pageContent = (
      <PostCommentsPage
        loading={this.state.loading}
        post={this.props.post}
        navigator={this.props.navigator}
        commentInputAutoFocus={this.props.commentInputAutoFocus}/>
    );

    return (
      <View>
        <OverlayPage
          content={pageContent}
          onBackArrowPress={() => {
            PostUtils.trimPostCommentForFeed(this.props.post);
            this.props.post.moreCommentsToShow = true;
            this.props.navigator.pop();
          }}
          bannerTitle='Comments'
          bumpContentUpWhenKeyboardShows={true}/>

            <CommentInput
              id={this.props.post.id}
              postIdString={this.props.post.postIdString}
              onSubmitComment={this.props.onSubmitComment}
              isCommentRequestInFlight={this.props.isCommentRequestInFlight}
              commentInputAutoFocus={this.props.commentInputAutoFocus}/>
      </View>
    );
  }

});

module.exports = PostCommentsPopup;
