'use strict';

var ReactNative = require('react-native');

var {
  AlertIOS
} = ReactNative;

var CampusScoreInfoAlert = {

  show: function() {
    AlertIOS.alert(
      'Your campus score is your street cred at college. Your score will increase as other students start checking out ' +
      'your profile, and interacting with the content you post.',
      ''
      [
        {
          text: 'Cool!'
        }
      ]
    );
  }

};

module.exports = CampusScoreInfoAlert;
