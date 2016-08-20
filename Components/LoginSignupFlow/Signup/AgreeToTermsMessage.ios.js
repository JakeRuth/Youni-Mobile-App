'use strict';

var React = require('react');
var ReactNative = require('react-native');

var EULAAgreementPage = require('../EULAAgreementPage');

var {
  Text,
  View,
  Dimensions,
  StyleSheet,
  Linking
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent'
  },
  top: {
    marginTop: 20,
    width: Dimensions.get('window').width,
    color: 'white',
    fontWeight: '100',
    textAlign: 'center'
  },
  bottom: {
    width: Dimensions.get('window').width,
    color: 'white',
    fontWeight: '100',
    textAlign: 'center',
    paddingBottom: 15 // makes the text easier to click
  },
  underline: {
    textDecorationLine: 'underline'
  }
});

var AgreeToTermsMessage = React.createClass({

  propType: {
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    return (
      <View style={styles.container}>

        <Text style={styles.top}>
          By signing up, you agree to our
        </Text>

        <Text style={styles.bottom}>
          <Text
            style={styles.underline}
            onPress={() => this.props.navigator.push({ component: EULAAgreementPage })}>
            Terms
          </Text>
          {' & '}
          <Text
            style={styles.underline}
            onPress={() => Linking.openURL('http://youniapp.com/privacyPolicy.html')}>
            Privacy Policy
          </Text>
        </Text>

      </View>
    );
  }

});

module.exports = AgreeToTermsMessage;
