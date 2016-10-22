'use strict';

var React = require('react');
var ReactNative = require('react-native');

var ViewCampusChallengeSubmissionButton = require('./ViewCampusChallengeSubmissionButton');

var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    paddingTop: 12
  },
  label: {
    color: Colors.DARK_GRAY,
    fontSize: 18,
    marginBottom: 8,
    marginHorizontal: 12
  },
  coverPhoto: {
    width: Dimensions.get('window').width,
    height: 138
  },
  challengeTitle: {
    alignSelf: 'center',
    fontSize: 50,
    textAlign: 'center',
    height: 60,
    width: Dimensions.get('window').width * .9,
    marginHorizontal: 12
  },
  prize: {
    color: Colors.MED_GRAY,
    fontSize: 20,
    textAlign: 'center',
    height: 25,
    marginHorizontal: 12
  }
});

var CampusChallengeHeader = React.createClass({

  propTypes: {
    campusChallenge: React.PropTypes.object.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    return (
      <View style={styles.container}>
        
        <Text style={styles.label}>
          Today's challenge:
        </Text>

        <Image
          style={styles.coverPhoto}
          resizeMode="cover"
          source={{uri: this.props.campusChallenge.coverPhotoUrl}}/>
        
        <Text
          style={[styles.challengeTitle, {color: Colors.getPrimaryAppColor()}]}
          numberOfLines={1}
          adjustsFontSizeToFit={true}>
          {this.props.campusChallenge.name}
        </Text>
        
        <Text style={styles.prize}>
          {this.props.campusChallenge.prizes[0]}
        </Text>
        
        <ViewCampusChallengeSubmissionButton {...this.props}/>
        
      </View>
    );
  }

});

module.exports = CampusChallengeHeader;
