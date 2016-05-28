'use strict';

var React = require('react-native');
var PostHeader = require('./PostHeader');
var CommentList = require('./Footer/CommentList');
var CommentInput = require('./Footer/CommentInput');
var Spinner = require('../Common/Spinner');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var PostUtils = require('../../Utils/Post/PostUtils');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var {
  View,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  container: {
    marginLeft: 8,
    marginRight: 8
  }
});

var PostCommentPage = React.createClass({

  propTypes: {
    loading: React.PropTypes.bool.isRequired,
    post: React.PropTypes.object.isRequired,
    comments: React.PropTypes.array.isRequired,
    navigator: React.PropTypes.object.isRequired,
    commentInputAutoFocus: React.PropTypes.bool,
    submitCommentCallback: React.PropTypes.func.isRequired
  },

  getInitialState: function() {
    return {
      isCommentRequestInFlight: false
    };
  },

  render: function() {
    var content;

    if (this.props.loading) {
      content = (
        <Spinner/>
      );
    }
    else {
      content = this._renderContent();
    }

    return (
      <View>
        {content}
      </View>
    );
  },

  _renderContent: function() {
    return (
      <View style={styles.container}>
        <PostHeader
          post={this.props.post}
          viewerIsPostOwner={false}
          renderedFromProfileView={false}
          hideActionButton={true}/>

        <CommentList
          comments={this.props.comments}
          navigator={this.props.navigator}/>

        <CommentInput
          id={this.props.post.id}
          postIdString={this.props.post.postIdString}
          onSubmitComment={this._onSubmitComment}
          isCommentRequestInFlight={this.state.isCommentRequestInFlight}
          commentInputAutoFocus={this.props.commentInputAutoFocus}/>
      </View>
    );
  },

  _onSubmitComment: function(comment) {
    var that = this,
        userId = userLoginMetadataStore.getUserId();

    if (!comment) {
      return;
    }

    this.setState({
      isCommentRequestInFlight: true
    });

    AjaxUtils.ajax(
      '/post/createComment',
      {
        postIdString: that.props.post.postIdString,
        userIdString: userId,
        comment: comment
      },
      (res) => {
        that.props.submitCommentCallback(comment);

        that.setState({
          isCommentRequestInFlight: false
        });
      },
      () => {
        that.setState({
          isCommentRequestInFlight: false
        });
      }
    );
  }

});

module.exports = PostCommentPage;
