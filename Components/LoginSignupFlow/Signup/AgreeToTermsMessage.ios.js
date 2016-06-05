'use strict';

var React = require('react-native');
var EULAAgreementPage = require('../EULAAgreementPage');

var {
  Text,
  View,
  Dimensions,
  StyleSheet
} = React;

var styles = StyleSheet.create({
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

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    return (
      <View>

        <Text style={styles.top}>
          By signing up, you agree to our
        </Text>

        <Text
          style={styles.bottom}
          onPress={() => {
            this.props.navigator.push({
              component: EULAAgreementPage
            });
          }}>
          <Text style={styles.underline}>Terms</Text> & <Text style={styles.underline}>Privacy Policy</Text>
        </Text>

      </View>
    );
  }

});

module.exports = AgreeToTermsMessage;
