'use strict';

var Communications = require('react-native-communications');

var CommunicationUtils = {

  sendText: function(phoneNumbers, message) {
    Communications.default.text(phoneNumbers, message);
  }

};

module.exports = CommunicationUtils;
