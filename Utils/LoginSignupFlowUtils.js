'use strict';

var Unicycle = require('../Unicycle');
var loginSignupStore = require('../stores/LoginSignupStore');
var AsyncStorageUtils = require('./Common/AsyncStorageUtils');
var AjaxUtils = require('./Common/AjaxUtils');

var LoginSignupFlowUtils = {

  attemptToAutoLoginUser: function (successCallback, failureCallback) {
    var response = AsyncStorageUtils.getEmailAndPassword((response) => {
      var email = response[0][1],
          password = response[1][1];

      loginSignupStore.setEmail(email);
      loginSignupStore.setPassword(password);

      if (email && password) {
        this.loginRequest(successCallback, failureCallback);
      }
      else {
        failureCallback();
      }
    });
  },

  loginRequest: function (successCallback, failureCallback) {
    var that = this,
        email = loginSignupStore.getEmail(),
        password = loginSignupStore.getPassword();

    loginSignupStore.setIsLoginRequestInFlight(true);

    //fixes weird bug where blank password field validates (cannot replicate at command line with api)
    if (!password) {
      password = '~';
    }
    if (!email) {
      email = '~';
    }

    AjaxUtils.ajax(
      '/api/login',
      {
        username: email.toLowerCase(),
        password: password
      },
      (res) => {
        var userId = res.body.userId,
            refreshToken = res.body.refreshToken,
            accessToken = res.body.accessToken,
            email = res.body.username,
            firstName = res.body.firstName,
            lastName = res.body.lastName,
            networkName = res.body.networkName;

        Unicycle.exec(
          'setAllMetadata',
          accessToken,
          refreshToken,
          userId,
          email,
          firstName,
          lastName,
          networkName
        );

        AsyncStorageUtils.saveItem('userId', userId);
        AsyncStorageUtils.saveItem('email', email);
        AsyncStorageUtils.saveItem('password', password);
        AsyncStorageUtils.saveItem('refreshToken', refreshToken);
        AsyncStorageUtils.saveItem('accessToken', accessToken);

        loginSignupStore.setIsLoginRequestInFlight(false);
        successCallback();
      },
      () => {
        loginSignupStore.setIsLoginRequestInFlight(false);
        failureCallback();
      }
    );
  }

};

module.exports = LoginSignupFlowUtils;
