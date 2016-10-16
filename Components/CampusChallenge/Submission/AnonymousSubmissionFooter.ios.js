'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');

var CampusChallengeSubmissionUpVotesPopup = require('../../PopupPages/CampusChallengeSubmissionUpVotesPopup');
var ViewLikes = require('../../Post/Footer/Like/ViewLikes');
var Caption = require('../../Post/Footer/Caption');

var {
  View,
  StyleSheet,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingTop: 5
  }
});

var AnonymousSubmissionFooter = React.createClass({

  propTypes: {
    submission: React.PropTypes.object.isRequired,
    upVoteAction: React.PropTypes.func.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    var submission = this.props.submission;

    return (
      <View style={styles.container}>

        <TouchableHighlight
          onPress={this._onHeartIconPress}
          underlayColor='transparent'>
          <Icon
            style={styles.icon}
            color="red"
            name={this._getHeartIconName()}
            size={40}/>
        </TouchableHighlight>

        <ViewLikes
          numLikes={this.props.submission.numVotes}
          onPress={() => {
            this.props.navigator.push({
              component: CampusChallengeSubmissionUpVotesPopup,
              passProps: {
                submissionId: this.props.submission.id
              }
            });
          }}/>

        <Caption text={this.props.submission.caption}/>

      </View>
    );
  },
  
  _onHeartIconPress: function() {
    if (!this.props.submission.upVoted) {
      this.props.upVoteAction(this.props.submission.id);
    }
  },

  _getHeartIconName: function() {
    if (this.props.submission.upVoted) {
      return 'ios-heart';
    }
    else {
      return 'ios-heart-outline';
    }
  }

});

module.exports = AnonymousSubmissionFooter;
