'use strict';

var React = require('react');
var ReactNative = require('react-native');

var SubmissionGridThumbnail = require('./Submission/SubmissionGridThumbnail');
var CampusChallengePopup = require('../PopupPages/CampusChallengePopup');

var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Text,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12
  },
  nameAndDate: {
    flex: 1
  },
  name: {
    alignItems: 'center',
    color: Colors.DARK_GRAY,
    fontSize: 20
  },
  endDate: {
    color: Colors.MED_GRAY,
    fontSize: 14
  },
  seeAllLink: {
    color: Colors.MED_GRAY,
    fontSize: 14
  },
  winningPhotos: {
    flexDirection: 'row'
  }
});

var PastChallengeWinnersListItem = React.createClass({

  propTypes: {
    challenge: React.PropTypes.object.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    var winningSubmissions = this.props.challenge.winningSubmissions,
        winningPhotos = [];

    for (var i = 0; i < winningSubmissions.length; i++) {
      winningPhotos.push(
        <SubmissionGridThumbnail
          key={i}
          submission={winningSubmissions[i]}/>
      );
    }

    return (
      <View>

        <View style={styles.header}>
          <View style={styles.nameAndDate}>
            <Text style={styles.name}>
              {this.props.challenge.name}
            </Text>
            <Text style={styles.endDate}>
              Ended: {this.props.challenge.endDate}
            </Text>
          </View>

          <Text
            style={styles.seeAllLink}
            onPress={() => {
              this.props.navigator.push({
                component: CampusChallengePopup,
                passProps: {...this.props}
              });
            }}>
            See All
          </Text>
        </View>

        <View style={styles.winningPhotos}>
          {winningPhotos}
        </View>

      </View>
    );
  }

});

module.exports = PastChallengeWinnersListItem;
