'use strict';

var React = require('react');
var ReactNative = require('react-native');

var Submission = require('../CampusChallenge/Submission/Submission');
var YouniHeader = require('../Common/YouniHeader');
var BackArrow = require('../Common/BackArrow');

var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  pageHeaderLabel: {
    fontSize: 20,
    fontWeight: '500',
    color: 'white',
    textAlign: 'center'
  },
  votesText: {
    fontSize: 18,
    width: Dimensions.get('window').width,
    textAlign: 'center',
    marginBottom: 10
  }
});

var LoggedInUserCampusChallengeSubmissionsPopup = React.createClass({

  propTypes: {
    submissions: React.PropTypes.array.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function () {
    let submissions = [];

    for (let i = 0; i < this.props.submissions.length; i++) {
      let votesElement,
          submission = this.props.submissions[i],
          votesText = this._getSubmissionVotesText(submission.numVotes);

      if (votesText) {
        votesElement = (
          <Text style={[styles.votesText, { color: Colors.getPrimaryAppColor() }]}>
            {votesText}
          </Text>
        );
      }

      submissions.push(
        <View key={i}>
          <Submission
            submission={submission}
            navigator={this.props.navigator}/>
          {votesElement}
        </View>
      );
    }

    return (
      <View style={styles.container}>

        <YouniHeader style={{backgroundColor: Colors.getPrimaryAppColor()}}>
          <Text style={styles.pageHeaderLabel}>
            Your Submissions
          </Text>
          <BackArrow
            color="white"
            onPress={() => this.props.navigator.pop()}/>
        </YouniHeader>

        <ScrollView
          automaticallyAdjustContentInsets={false}>
          {submissions}
        </ScrollView>

      </View>
    );
  },

  _getSubmissionVotesText: function(numVotes) {
    if (numVotes > 1) {
      return `${numVotes} votes`;
    }
    else if (numVotes === 1) {
      return '1 vote';
    }
    else {
      return '';
    }
  }

});

module.exports = LoggedInUserCampusChallengeSubmissionsPopup;
