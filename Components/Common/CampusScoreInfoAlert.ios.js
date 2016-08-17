'use strict';

var ReactNative = require('react-native');

var {
  AlertIOS
} = ReactNative;

var CampusScoreInfoAlert = {

  show: function() {
    AlertIOS.alert(
      'Campus score is like your street cred at college.',
      'You can increase your campus score in a number of ways, all revolving around you getting interaction from ' +
      'fellow students.  A few examples of this are getting likes, follows, and comments on your posts.',
      [
        {
          text: 'Cool!'
        }
      ]
    );
  }

};

module.exports = CampusScoreInfoAlert;
