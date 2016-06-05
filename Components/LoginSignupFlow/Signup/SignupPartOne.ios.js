'use strict';

var React = require('react-native');
var PrettyInput = require('../../Common/PrettyInput');

var {
  View,
  StyleSheet,
  Dimensions
} = React;

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

  propTypes: {
    onEmailInputChange: React.PropTypes.func.isRequired,
    onPasswordInputChange: React.PropTypes.func.isRequired,
    onConfirmPasswordInputChange: React.PropTypes.func.isRequired
  },

  render: function() {
    return (
      <View style={styles.container}>
        <View style={styles.emailInputContainer}>
          <PrettyInput
            style={{
              width: Dimensions.get('window').width * .8,
              height: 44
            }}
            onTextChange={this.props.onEmailInputChange}
            placeholder='email@college.edu'
            keyboardType='email-address'/>
        </View>
        <View style={styles.passwordInputContainer}>
          <PrettyInput
            style={{
              width: Dimensions.get('window').width * .8,
              height: 44
            }}
            onTextChange={this.props.onPasswordInputChange}
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
            onTextChange={this.props.onConfirmPasswordInputChange}
            secureTextEntry={true}
            clearTextOnFocus={true}
            placeholder='Confirm Password'/>
        </View>
      </View>
    );
  },

  // TODO: This will probably go on LoginSignupFlow
  onSignUpButtonPress: function() {
    if (this._assertAllFieldsAreNotBlank()) {
      this._alertMissingField();
    }
    else if (!this._doPasswordsMatch()) {
      this._alertPasswordMismatch();
    }
    else if (this.state.password.length < this.MIN_PASSWORD_LENGTH) {
      this._alertPasswordNotLongEnough();
    }
  },

  _assertAllFieldsAreNotBlank: function() {
    var email = this.state.email,
        password = this.state.password,
        confirmPassword = this.state.confirmPassword;

    return (
      email.length === 0 ||
      password.length === 0 ||
      confirmPassword.length === 0
    );
  },

  _emailMustEndInEdu: function() {
    return this.state.email.endsWith('.edu');
  },

  _doPasswordsMatch: function() {
    return this.state.password === this.state.confirmPassword;
  },

  _alertMissingField: function() {
    AlertIOS.alert(
      'All fields must be filled',
      '',
      [
        {
          text: 'Ok'
        }
      ]
    );
  },

  _alertPasswordMismatch: function() {
    AlertIOS.alert(
      'Oops',
      'Passwords must match',
      [
        {
          text: 'Ok'
        }
      ]
    );
  },

  _alertPasswordNotLongEnough: function() {
    AlertIOS.alert(
      'Password too short',
      'It must be at least 6 characters long',
      [
        {
          text: 'Ok'
        }
      ]
    );
  },

  _alertEmailIsUnexpected: function() {
    AlertIOS.alert(
      'Unexpected email format',
      'Emails must end with .edu',
      [
        {
          text: 'Ok'
        }
      ]
    );
  },

  MIN_PASSWORD_LENGTH: 6

});

module.exports = SignupPartOne;
