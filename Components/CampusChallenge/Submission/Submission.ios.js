'use strict';

var React = require('react');
var ReactNative = require('react-native');

var AnonymousSubmission = require('./AnonymousSubmission');
var Post = require('../../Post/Post');

var Submission = React.createClass({

  propTypes: {
    submission: React.PropTypes.object.isRequired,
    onSubmitCommentAction: React.PropTypes.func,
    onDeleteCommentAction: React.PropTypes.func,
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
          renderedFromCampusChallenge={true}
          likePhotoAction={this.upVotePostAction}
          unlikePhotoAction={this.removeUpVoteForPostAction}/>
      );
    }
  },

  // this function needs to get wrapped since the submission object ins't available in a post
  upVotePostAction: function() {
    this.props.upVoteAction(this.props.submission.id);
  },
  
  removeUpVoteForPostAction: function() {
    this.props.removeUpVoteAction(this.props.submission.id);
  }

});

module.exports = Submission;
