'use strict';

var React = require('react-native');

var {
  Text,
  View,
  Dimensions,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  topLine: {
    marginTop: 20,
    width: Dimensions.get('window').width,
    color: 'white',
    fontWeight: '100',
    textAlign: 'center'
  },
  bottomLine: {
    width: Dimensions.get('window').width,
    color: 'white',
    fontWeight: '100',
    textAlign: 'center'
  },
  underline: {
    textDecorationLine: 'underline'
  }
});

var AgreeToTermsMessage = React.createClass({

  render: function() {
    return (
      <View>

        <Text style={styles.topLine}>
          By signing up, you agree to our
        </Text>

        <Text style={styles.bottomLine}>
          <Text style={styles.underline}>Terms</Text> & <Text style={styles.underline}>Privacy Policy</Text>
        </Text>

      </View>
    );
  }

});

module.exports = AgreeToTermsMessage;
