'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');

var ViewCampusChallengeSubmissionButton = require('./ViewCampusChallengeSubmissionButton');

var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  AlertIOS
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    paddingTop: 12
  },
  labelAndInfoButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingBottom: 8
  },
  label: {
    flex: 1,
    color: Colors.DARK_GRAY,
    fontSize: 18
  },
  coverPhoto: {
    width: Dimensions.get('window').width,
    height: 138
  },
  challengeTitle: {
    alignSelf: 'center',
    fontSize: 30,
    textAlign: 'center',
    width: Dimensions.get('window').width * .9,
    margin: 12
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

        <View style={styles.labelAndInfoButtonContainer}>
          <Text style={styles.label}>
            Today's challenge:
          </Text>
          <Icon
            onPress={this.onHelpIconPress}
            name='help'
            size={25}
            color={Colors.getPrimaryAppColor()}/>
        </View>

        <Image
          style={styles.coverPhoto}
          resizeMode="cover"
          source={{uri: this.props.campusChallenge.coverPhotoUrl}}/>
        
        <Text style={[styles.challengeTitle, {color: Colors.getPrimaryAppColor()}]}>
          Fuck Shit
        </Text>
        
        <Text style={styles.prize}>
          {this.props.campusChallenge.prizes[0]}
        </Text>
        
        <ViewCampusChallengeSubmissionButton {...this.props}/>
        
      </View>
    );
  },

  onHelpIconPress: function() {
    AlertIOS.alert(
      this.props.campusChallenge.name,
      this.props.campusChallenge.description,
      [
        {
          text: 'Okay'
        }
      ]
    );
  }

});

module.exports = CampusChallengeHeader;
