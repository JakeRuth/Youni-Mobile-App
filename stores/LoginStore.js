'use strict';

var React = require('react-native');
var Unicycle = require('./../Unicycle');
var AsyncStorageUtils = require('../Utils/Common/AsyncStorageUtils');
var AjaxUtils = require('../Utils/Common/AjaxUtils');

var loginStore = Unicycle.createStore({

  init: function() {
    this.set({
      email: '',
      password: '',
      isLoginRequestInFlight: false
    });
  },

  loginRequest: function(successCallback, failureCallback) {
    var that = this,
        email = this.getEmail(),
        password = this.getPassword();

    this.setIsLoginRequestInFlight(true);

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

        that.setIsLoginRequestInFlight(false);
        successCallback();
      },
      () => {
        that.setIsLoginRequestInFlight(false);
        failureCallback();
      }
    );
  },

  setEmail: function(email) {
    this.set({
      email: email
    });
  },

  setPassword: function(password) {
    this.set({
      password: password
    });
  },

  setIsLoginRequestInFlight: function(value) {
    this.set({
      isLoginRequestInFlight: value
    });
  },

  isLoginRequestInFlight: function() {
    return this.get('isLoginRequestInFlight');
  },

  getEmail: function() {
    return this.get('email');
  },

  getPassword: function() {
    return this.get('password');
  }

});

module.exports = loginStore;
