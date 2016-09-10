'use strict';

var ReactNative = require('react-native');
var Composer = require('NativeModules').RNMessageComposer;

var {
  AlertIOS
} = ReactNative;

var CommunicationUtils = {

  sendText: function(phoneNumbers, message) {
    Composer.composeMessageWithArgs(
      {
        messageText: message,
        subject: '',
        recipients:  phoneNumbers
      },
      (result) => {
        switch(result) {
          case Composer.Sent:
            AlertIOS.alert(
              'Message sent!',
              '',
              {
                text: 'Okay'
              }
            );
            break;
          case Composer.Cancelled:
            AlertIOS.alert(
              'Message sending was cancelled.',
              '',
              {
                text: 'Okay'
              }
            );
            break;
          case Composer.Failed:
            AlertIOS.alert(
              'Failed to send the message.',
              '',
              {
                text: 'Okay'
              }
            );
            break;
          case Composer.NotSupported:
            AlertIOS.alert(
              'This device does not support sending texts.',
              '',
              {
                text: 'Okay'
              }
            );
            break;
          default:
            AlertIOS.alert(
              'An unexpected error occured.  If this continues please contact support@youniapp.com',
              '',
              {
                text: 'Okay'
              }
            );
            break;
        }
      }
    );
  }

};

module.exports = CommunicationUtils;
