'use strict';

var React = require('react');
var ReactNative = require('react-native');

var {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  AlertIOS
} = ReactNative;

var originalSuccessfulSignupGraphicDimensions = {
  width: 750,
  height: 507
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    alignItems: 'center',
    width: Dimensions.get('window').width
  },
  heading: {
    backgroundColor: 'transparent',
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
    marginBottom: 20
  },
  subHeading: {
    backgroundColor: 'transparent',
    textAlign: 'center',
    color: 'white',
    fontSize: 14,
    width: Dimensions.get('window').width * .9
  },
  successEnvelopeImage: {
    flex: 1,
    width: originalSuccessfulSignupGraphicDimensions.width * .3,
    height: originalSuccessfulSignupGraphicDimensions.height * .3
  },
  checkJunkFolderMessage: {
    backgroundColor: 'transparent',
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 13,
    marginBottom: 14
  }
});

var SuccessfulSignupMessage = React.createClass({

  componentDidMount: function() {
    setTimeout(function() {
      AlertIOS.alert(
        'Email may be in the junk folder!!!',
        ''
        [
          {
            text: 'Okay'
          }
        ]
      );
    }, 1000);
  },

  render: function() {
    return (
      <View style={styles.container}>

        <Text style={styles.heading}>
          Confirmation email sent
        </Text>

        <Text style={styles.subHeading}>
          Click on the activation link to confirm you are in college and then log into Youni
        </Text>

        <Image
          style={styles.successEnvelopeImage}
          resizeMode="contain"
          source={require('../../../images/emailGraphic.png')}/>

        <Text style={styles.checkJunkFolderMessage}>
          Make sure to check your junk folder!
        </Text>

      </View>
    );
  }

});

module.exports = SuccessfulSignupMessage;
