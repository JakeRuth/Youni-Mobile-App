'use strict';

var ReactNative = require('react-native');

var {
  AlertIOS
} = ReactNative;

var LoginSignupFlowAlerts = {

  missingFields: function() {
    this._showAlert('All fields must be filled', '');
  },

  passwordsMustMatch: function() {
    this._showAlert('Oops', 'Passwords must match');
  },

  passwordNotLongEnough: function() {
    this._showAlert('Password too short', 'It must be at least 6 characters long');
  },

  unexpectedEmailFormat: function() {
    this._showAlert('Unexpected email format', 'Email must be valid, contain no whitespaces, and end with .edu');
  },

  signupSuccess: function(message) {
    this._showAlert('Confirmation email sent', message);
  },

  emailAlreadyInUse: function(message) {
    this._showAlert('Email already in use', message);
  },

  addedToWaitlist: function(message) {
    this._showAlert('Coming soon!', message);
  },

  signupError: function() {
    this._showAlert('Oops! An unexpected error occurred',
      'Please contact support@youniapp.com with your sign up information and we can help you');
  },

  successfulSignupCheckEmailButton: function() {
    this._showAlert('What are you waiting for?  Go to your school email to activate your account!')
  },

  _showAlert: function(title, subTitle) {
    AlertIOS.alert(
      title,
      subTitle,
      [
        {
          text: 'Ok'
        }
      ]
    );
  }

};

module.exports = LoginSignupFlowAlerts;
