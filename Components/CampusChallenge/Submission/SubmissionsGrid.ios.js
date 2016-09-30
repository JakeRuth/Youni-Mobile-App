'use strict';

var React = require('react');
var ReactNative = require('react-native');

var SubmissionGridThumbnail = require('./SubmissionGridThumbnail');

var Colors = require('../../../Utils/Common/Colors');

var {
  View,
  Text,
  Image,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  voteCount: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 5,
    color: 'white',
    fontSize: 16,
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 3,
    textShadowColor: Colors.DARK_TEXT_SHADOW
  },
  winningSubmissionBadgeImage: {
    position: 'absolute',
    top: 3,
    right: 3,
    height: 30,
    width: 30
  }
});

var SubmissionsGrid = React.createClass({

  propTypes: {
    submissions: React.PropTypes.array.isRequired,
    winningSubmissions: React.PropTypes.array,
    upVoteAction: React.PropTypes.func.isRequired,
    removeUpVoteAction: React.PropTypes.func.isRequired,
    onSubmitCommentAction: React.PropTypes.func.isRequired,
    onDeleteCommentAction: React.PropTypes.func.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    var submissionsJson = this.props.submissions,
        winningSubmissionsJson = this.props.winningSubmissions,
        submissionElements = [];

    // if there are winning submissions render them first
    if (winningSubmissionsJson) {
      for (var j = 0; j < winningSubmissionsJson.length; j++) {
        submissionElements.push(this._renderGridItem(winningSubmissionsJson[j], j));
      }
    }

    for (var i = 0; i < submissionsJson.length; i++) {
      // don't re render a winning submission
      if (!this.didSubmissionWinFinishedChallenge(submissionsJson[i])) {
        submissionElements.push(this._renderGridItem(submissionsJson[i], i));
      }
    }

    return (
      <View style={styles.container}>
        {submissionElements}
      </View>
    );
  },
  
  _renderGridItem: function(submission, index) {
    if (submission) {
      return (
        <SubmissionGridThumbnail
          {...this.props}
          key={index}
          submission={submission}>
          {this._renderGridItemChildren(submission)}
        </SubmissionGridThumbnail>
      );
    }
  },

  _renderGridItemChildren: function(submission) {
    // past challenges have slightly different grid UI then active challenge
    if (this.props.winningSubmissions && this.props.winningSubmissions.length > 0) {
      if (this.didSubmissionWinFinishedChallenge(submission)) {
        return this._renderSpecialWinningBadge(submission);
      }
    }
    else {
      if (submission.numVotes > 0) {
        return (
          <Text style={styles.voteCount}>
            {submission.numVotes}
          </Text>
        );
      }
    }
  },

  _renderSpecialWinningBadge: function(submission) {
    let indexOfWinningSubmission;

    for (let i = 0; i < this.props.winningSubmissions.length; i++) {
      if (submission.id === this.props.winningSubmissions[i].id) {
        indexOfWinningSubmission = i;
        break;
      }
    }

    //first place
    if (indexOfWinningSubmission === 0) {
      return (
        <Image
          style={styles.winningSubmissionBadgeImage}
          resizeMode="contain"
          source={require('../../../images/firstPlace.png')}/>
      );
    }
    //second place
    else if (indexOfWinningSubmission === 1) {
      return (
        <Image
          style={styles.winningSubmissionBadgeImage}
          resizeMode="contain"
          source={require('../../../images/secondPlace.png')}/>
      );
    }
    //third place
    else if (indexOfWinningSubmission === 2) {
      return (
        <Image
          style={styles.winningSubmissionBadgeImage}
          resizeMode="contain"
          source={require('../../../images/thirdPlace.png')}/>
      );
    }
  },

  didSubmissionWinFinishedChallenge: function(submission) {
    if (!this.props.winningSubmissions || !this.props.winningSubmissions.length) {
      return false;
    }

    var isSubmissionAWinningSubmission = this.props.winningSubmissions.find((winningSub) => {
      return winningSub.id === submission.id;
    });
    return isSubmissionAWinningSubmission !== undefined;
  }

});

module.exports = SubmissionsGrid;
