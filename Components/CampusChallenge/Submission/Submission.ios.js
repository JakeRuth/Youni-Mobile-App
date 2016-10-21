'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');

var SubmissionHeader = require('./SubmissionHeader');
var SubmissionFooter = require('./SubmissionFooter');
var Spinner = require('../../Common/Spinner');

var Colors = require('../../../Utils/Common/Colors');

var {
  View,
  Image,
  Text,
  Dimensions,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  submissionContainer: {
    flex: 1,
    width: Dimensions.get('window').width - 24, // subtract horizontal margin
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
    backgroundColor: 'white'
  },
  votesText: {
    fontSize: 18,
    width: Dimensions.get('window').width,
    textAlign: 'center',
    marginBottom: 10
  }
});

var Submission = React.createClass({

  MAX_IMAGE_HEIGHT: Dimensions.get('window').height / 2.5,

  propTypes: {
    submission: React.PropTypes.object.isRequired,
    navigator: React.PropTypes.object
  },

  getInitialState: function() {
    return {
      showImageLoader: true
    };
  },

  render: function() {
    var submission = this.props.submission;

    return (
      <View style={styles.container}>
        <View style={styles.submissionContainer}>

          <SubmissionHeader {...this.props}/>

          <Image
            style={[styles.submissionImage, {height: this._getImageHeight()}]}
            resizeMode="contain"
            source={{uri: submission.photoUrl}}
            onLoadStart={() => this.setState({ showImageLoader: true })}
            onLoadEnd={() => this.setState({ showImageLoader: false })}>
            {this._renderImageLoadingSpinner()}
          </Image>

          <SubmissionFooter {...this.props}/>

        </View>

        {this._renderVotesCount(submission)}
      </View>
    );
  },
  
  _renderVotesCount: function(submission) {
    if (submission.numVotes > 0) {
      return (
        <Text style={[styles.votesText, { color: Colors.getPrimaryAppColor() }]}>
          {this._getSubmissionVotesText(submission.numVotes)}
        </Text>
      );
    }
  },

  _renderImageLoadingSpinner: function() {
    if (this.state.showImageLoader) {
      return <Spinner/>;
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
  },

  _getSubmissionVotesText: function(numVotes) {
    if (numVotes > 1) {
      return `${numVotes} votes`;
    }
    else {
      return '1 vote';
    }
  }

});

module.exports = Submission;
