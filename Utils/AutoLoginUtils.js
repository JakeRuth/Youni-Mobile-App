'use strict';

var Unicycle = require('../Unicycle');
var loginStore = require('../stores/LoginStore');
var AsyncStorageUtils = require('./Common/AsyncStorageUtils');

var AutoLoginUtils = {

  attemptToAutoLoginUser: function (successCallback, failureCallback) {
    AsyncStorageUtils.getEmailAndPassword((response) => {
      var email = response[0][1],
          password = response[1][1];

      if (email && password) {
        loginStore.setEmail(email);
        loginStore.setPassword(password);
        loginStore.loginRequest(successCallback, failureCallback);
      }
      else {
        failureCallback();
      }
    });
  }

};

module.exports = AutoLoginUtils;
