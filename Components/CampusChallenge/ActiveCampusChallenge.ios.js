'use strict';

var React = require('react');
var ReactNative = require('react-native');

var ChallengeCoverPhoto = require('./ChallengeCoverPhoto');
var SubmissionPostViewControls = require('./SubmissionPostViewControls');

var Colors = require('../../Utils/Common/Colors');
var PostViewType = require('../../Utils/Enums/PostViewType');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  endTime: {
    fontSize: 18,
    textAlign: 'center'
  }
});

var ActiveCampusChallenge = React.createClass({

  propTypes: {
    challenge: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired,
      description: React.PropTypes.string.isRequired,
      coverPhotoUrl: React.PropTypes.string.isRequired,
      secondsRemaining: React.PropTypes.number.isRequired,
      minutesRemaining: React.PropTypes.number.isRequired,
      hoursRemaining: React.PropTypes.number.isRequired,
      daysRemaining: React.PropTypes.number.isRequired
    }).isRequired
  },

  render: function() {
    return (
      <View style={styles.container}>

        <ChallengeCoverPhoto
          name={this.props.challenge.name}
          description={this.props.challenge.description}
          photoUrl={this.props.challenge.coverPhotoUrl}/>

        <SubmissionPostViewControls
          currentPostViewMode={PostViewType.GRID}
          onPostViewControlPress={()=>null}>
          <Text style={[styles.endTime, { color: Colors.getPrimaryAppColor() }]}>
            {this._getTimeRemainingText()}
          </Text>
        </SubmissionPostViewControls>

      </View>
    );
  },

  _getTimeRemainingText: function() {
    let {
      daysRemaining,
      hoursRemaining,
      minutesRemaining,
      secondsRemaining
    } = this.props.challenge;
    let message = '';

    if (daysRemaining) {
      message += `${daysRemaining}d `;
    }
    if (daysRemaining || hoursRemaining > 0) {
      message += `${hoursRemaining}h `;
    }
    if (daysRemaining || hoursRemaining || minutesRemaining > 0) {
      message += `${minutesRemaining}m`;
    }

    //edge case
    if (!daysRemaining && !hoursRemaining && !minutesRemaining) {
      message = `${secondsRemaining}s`;
    }

    return message;
  }

});

module.exports = ActiveCampusChallenge;
