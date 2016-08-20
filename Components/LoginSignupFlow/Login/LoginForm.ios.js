'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');

var loginStore = require('../../../stores/LoginStore');

var PrettyTouchable = require('../../Common/PrettyTouchable');
var PrettyInput = require('../../Common/PrettyInput');

var {
  View,
  Text,
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
    marginBottom: 20,
    position: 'relative'
  },
  showPasswordIcon: {
    position: 'absolute',
    backgroundColor: 'transparent',
    right: 5,
    top: 8
  }
});

var LoginForm = React.createClass({

  getInitialState: function() {
    return {
      showPassword: false
    };
  },

  render: function() {
    return (
      <View style={styles.container}>

        <View style={styles.emailInputContainer}>
          <PrettyInput
            style={{
              backgroundColor: 'transparent',
              width: Dimensions.get('window').width * .8,
              height: 44
            }}
            onTextChange={(email) => {
              loginStore.setEmail(email);
            }}
            placeholder='email@college.edu'
            keyboardType='email-address'/>
        </View>
        <View style={styles.passwordInputContainer}>
          <PrettyInput
            style={{
              backgroundColor: 'transparent',
              width: Dimensions.get('window').width * .8,
              height: 44
            }}
            onTextChange={(password) => {
              loginStore.setPassword(password);
            }}
            secureTextEntry={!this.state.showPassword}
            clearTextOnFocus={true}
            placeholder='Password'/>
          <Icon
            style={styles.showPasswordIcon}
            name={this._getShowPassIconName()}
            size={25}
            color='white'
            onPress={this._toggleShowPasswordState}/>
        </View>

      </View>
    );
  },

  _getShowPassIconName: function() {
    if (this.state.showPassword) {
      return 'visibility-off';
    }
    else {
      return 'visibility';
    }
  },

  _toggleShowPasswordState: function() {
    var originalState = this.state.showPassword;
    this.setState({
      showPassword: !originalState
    });
  }

});

module.exports = LoginForm;
