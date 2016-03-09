'use strict';

var React = require('react-native');
var PostHeader = require('./PostHeader');
var PostCommentsContainer = require('./Footer/PostCommentsContainer');
var Spinner = require('../Common/Spinner');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var PostUtils = require('../../Utils/Post/PostUtils');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var {
  View
} = React;

var PostCommentPage = React.createClass({

  propTypes: {
    loading: React.PropTypes.bool.isRequired,
    post: React.PropTypes.object.isRequired,
    navigator: React.PropTypes.object.isRequired
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
      <View>
        <PostHeader
          post={this.props.post}
          viewerIsPostOwner={false}
          renderedFromProfileView={false}
          hideActionButton={true}/>

        <PostCommentsContainer
          post={this.props.post}
          onSubmitComment={this._onSubmitComment}
          isCommentRequestInFlight={this.state.isCommentRequestInFlight}
          navigator={this.props.navigator}
          commentInputActive={true}/>
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
        that.props.post.firstComments.push({
          comment: comment,
          commenterName: userLoginMetadataStore.getFullName()
        });
        that.props.post.numComments++;

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
