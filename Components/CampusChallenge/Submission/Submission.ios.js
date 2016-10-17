'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');

var SubmissionHeader = require('./SubmissionHeader');
var SubmissionFooter = require('./SubmissionFooter');

var Colors = require('../../../Utils/Common/Colors');

var {
  View,
  Image,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    height: 433,
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 12,
    shadowColor: Colors.DARK_TEXT_SHADOW,
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0
    }
  },
  submissionImage: {
    flex: 1,
    justifyContent: "space-around",
    backgroundColor: '#F0F0F0'
  }
});

var Submission = React.createClass({

  MAX_IMAGE_HEIGHT: 306,

  propTypes: {
    submission: React.PropTypes.object.isRequired,
    upVoteAction: React.PropTypes.func.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    var submission = this.props.submission;

    return (
      <View style={styles.container}>

        <SubmissionHeader {...this.props}/>
        <Image
          style={[styles.submissionImage, {height: this._getImageHeight()}]}
          resizeMode="cover"
          source={{uri: submission.photoUrl}}/>
        <SubmissionFooter {...this.props}/>

      </View>
    );
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

module.exports = Submission;
