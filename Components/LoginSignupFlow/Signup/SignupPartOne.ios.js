'use strict';

var React = require('react');
var ReactNative = require('react-native');
var PrettyInput = require('../../Common/PrettyInput');
var signupStore = require('../../../stores/SignupStore');

var {
  View,
  Text,
  StyleSheet,
  Dimensions,
  AlertIOS
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    width: Dimensions.get('window').width
  },
  inputContainer: {
    marginBottom: 20
  },
  inviteCodeCalloutText: {
    backgroundColor: 'transparent',
    padding: 5,
    paddingLeft: 20,
    color: 'white'
  }
});

var SignupPartOne = React.createClass({

  render: function() {
    return (
      <View style={styles.container}>

        <View style={styles.inputContainer}>
          <PrettyInput
            style={{
              backgroundColor: 'transparent',
              width: Dimensions.get('window').width * .8,
              height: 44
            }}
            onTextChange={signupStore.setEmail}
            placeholder='email@college.edu'
            keyboardType='email-address'/>
        </View>

        <View style={styles.inputContainer}>
          <PrettyInput
            style={{
              backgroundColor: 'transparent',
              width: Dimensions.get('window').width * .8,
              height: 44
            }}
            onTextChange={signupStore.setPassword}
            secureTextEntry={true}
            clearTextOnFocus={true}
            placeholder='Password'/>
        </View>

        <View style={styles.inputContainer}>
          <PrettyInput
            style={{
              backgroundColor: 'transparent',
              width: Dimensions.get('window').width * .8,
              height: 44
            }}
            onTextChange={signupStore.setConfirmPassword}
            secureTextEntry={true}
            clearTextOnFocus={true}
            placeholder='Confirm Password'/>
        </View>

        <View style={styles.inputContainer}>
          <PrettyInput
            style={{
              backgroundColor: 'transparent',
              width: Dimensions.get('window').width * .8,
              height: 44
            }}
            onTextChange={signupStore.setInviteCode}
            placeholder='Invite Code (opt)'/>
          <Text
            style={styles.inviteCodeCalloutText}
            onPress={this._onInviteCodeTextCalloutPress}>
            What is this?
          </Text>
        </View>
        
      </View>
    );
  },
  
  _onInviteCodeTextCalloutPress: function() {
    AlertIOS.alert(
      'If you use a sign up code from a friend, both you and your friend will receive 1000 campus score points!',
      '',
      [
        {
          text: 'Ok'
        }
      ]
    );
  }

});

module.exports = SignupPartOne;
