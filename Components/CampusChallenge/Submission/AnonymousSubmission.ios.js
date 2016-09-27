'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');

var AnonymousSubmissionHeader = require('./AnonymousSubmissionHeader');
var AnonymousSubmissionFooter = require('./AnonymousSubmissionFooter');

var {
  View,
  Image,
  StyleSheet,
  TouchableWithoutFeedback
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginBottom: 1
  },
  submissionImage: {
    flex: 1,
    justifyContent: "space-around",
    backgroundColor: '#F0F0F0'
  }
});

var AnonymousSubmission = React.createClass({

  DOUBLE_TAP_TIME_CONSTRAINT: 250,
  MAX_IMAGE_HEIGHT: 420,

  propTypes: {
    submission: React.PropTypes.object.isRequired,
    upVoteAction: React.PropTypes.func.isRequired,
    removeUpVoteAction: React.PropTypes.func.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      timeOfLastPhotoTap: 0
    };
  },

  render: function() {
    var submission = this.props.submission;

    return (
      <View style={styles.container}>

        <AnonymousSubmissionHeader submission={this.props.submission}/>

        <TouchableWithoutFeedback onPress={this._onDoubleTapPhotoAction}>
          <Image
            style={[styles.submissionImage, {height: this._getImageHeight()}]}
            resizeMode="cover"
            source={{uri: submission.photoUrl}}/>
        </TouchableWithoutFeedback>

        <AnonymousSubmissionFooter {...this.props}/>

      </View>
    );
  },

  _onDoubleTapPhotoAction: function() {
    var timeDifference = new Date().getTime() - this.state.timeOfLastPhotoTap;

    if (timeDifference < this.DOUBLE_TAP_TIME_CONSTRAINT) {
      this._photoOnClickAction(this.props.submission.upVoted);
    }

    this.setState({
      timeOfLastPhotoTap: new Date().getTime()
    });
  },

  _photoOnClickAction: function(upVoted) {
    if (!upVoted) {
      this.props.upVoteAction(this.props.submission.id);
    }
  },


  _getImageHeight: function() {
    var height = this.props.submission.photoHeight / 2;
    if (height > 0 && height <= this.MAX_IMAGE_HEIGHT) {
      return height;
    }
    else {
      return this.MAX_IMAGE_HEIGHT;
    }
  }

});

module.exports = AnonymousSubmission;
