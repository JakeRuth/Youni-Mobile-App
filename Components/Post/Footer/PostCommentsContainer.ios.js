'use strict';

var React = require('react-native');
var Unicycle = require('../../../Unicycle');
var CommentInput = require('./CommentInput');
var CommentList = require('./CommentList');

var {
  View
} = React;

var PostCommentsContainer = React.createClass({

  propTypes: {
    postCommentsPopupComponent: React.PropTypes.any,
    post: React.PropTypes.object.isRequired,
    navigator: React.PropTypes.object.isRequired,
    onSubmitComment: React.PropTypes.func.isRequired,
    isCommentRequestInFlight: React.PropTypes.bool.isRequired
  },

  render: function() {
    var comments = <View/>;

    if (this.props.post.firstComments.length) {
      comments = (
        <CommentList
          postCommentsPopupComponent={this.props.postCommentsPopupComponent}
          post={this.props.post}
          navigator={this.props.navigator}/>
      );
    }

    return (
      <View>

        {comments}
        <CommentInput
          id={this.props.post.id}
          postIdString={this.props.post.postIdString}
          onSubmitComment={this.props.onSubmitComment}
          isCommentRequestInFlight={this.props.isCommentRequestInFlight}/>

      </View>
    );
  }

});

module.exports = PostCommentsContainer;
