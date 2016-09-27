'use strict';

var React = require('react');
var ReactNative = require('react-native');

var AnonymousSubmission = require('./AnonymousSubmission');
var Post = require('../../Post/Post');

var Submission = React.createClass({

  propTypes: {
    submission: React.PropTypes.object.isRequired,
    onSubmitCommentAction: React.PropTypes.func.isRequired,
    onDeleteCommentAction: React.PropTypes.func.isRequired,
    upVoteAction: React.PropTypes.func.isRequired,
    removeUpVoteAction: React.PropTypes.func.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    if (this.props.submission.isAnonymous) {
      return (
        <AnonymousSubmission {...this.props}/>
      );
    }
    else {
      return (
        <Post
          {...this.props}
          post={this.props.submission.postJson}
          likePhotoAction={this.props.upVoteAction}
          unlikePhotoAction={this.props.removeUpVoteAction}/>
      );
    }
  }

});

module.exports = Submission;
