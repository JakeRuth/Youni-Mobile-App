'use strict';

var React = require('react');
var ReactNative = require('react-native');

var AnonymousSubmission = require('./AnonymousSubmission');

var Submission = React.createClass({

  propTypes: {
    submission: React.PropTypes.object.isRequired,
    upVoteAction: React.PropTypes.func.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    return (
      <AnonymousSubmission {...this.props}/>
    );
  }

});

module.exports = Submission;
