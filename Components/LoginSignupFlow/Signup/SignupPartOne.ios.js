'use strict';

var React = require('react');
var ReactNative = require('react-native');
var PrettyInput = require('../../Common/PrettyInput');
var signupStore = require('../../../stores/SignupStore');

var {
  View,
  StyleSheet,
  Dimensions
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    width: Dimensions.get('window').width
  },
  emailInputContainer: {
    marginBottom: 20
  },
  passwordInputContainer: {
    marginBottom: 20
  },
  confirmPasswordInputContainer: {
    marginBottom: 20
  }
});

var SignupPartOne = React.createClass({

  render: function() {
    return (
      <View style={styles.container}>

        <View style={styles.emailInputContainer}>
          <PrettyInput
            style={{
              width: Dimensions.get('window').width * .8,
              height: 44
            }}
            onTextChange={signupStore.setEmail}
            placeholder='email@college.edu'
            keyboardType='email-address'/>
        </View>

        <View style={styles.passwordInputContainer}>
          <PrettyInput
            style={{
              width: Dimensions.get('window').width * .8,
              height: 44
            }}
            onTextChange={signupStore.setPassword}
            secureTextEntry={true}
            clearTextOnFocus={true}
            placeholder='Password'/>
        </View>

        <View style={styles.confirmPasswordInputContainer}>
          <PrettyInput
            style={{
              width: Dimensions.get('window').width * .8,
              height: 44
            }}
            onTextChange={signupStore.setConfirmPassword}
            secureTextEntry={true}
            clearTextOnFocus={true}
            placeholder='Confirm Password'/>
        </View>
        
      </View>
    );
  }

});

module.exports = SignupPartOne;
