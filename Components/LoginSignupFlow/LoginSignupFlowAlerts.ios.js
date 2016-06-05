'use strict';

var React = require('react-native');

var {
  AlertIOS
} = React;

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
    this._showAlert('Unexpected email format', 'Email must be valid, and end with .edu');
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
    )
  }

};

module.exports = LoginSignupFlowAlerts;
