'use strict';

var React = require('react-native');
var Unicycle = require('./../Unicycle');

var loginStore = Unicycle.createStore({

    init: function () {
      this.set({
        email: '',
        password: '',
        loginInFlight: false,
        //defaulted to false so the login page doesn't flash when a user is auto logged in
        shouldRenderLoginPage: false
      });
    },

    $login: function (username, password) {
      this.set({
        email: username,
        password: password
      });
    },

    $updateEmail: function(email) {
      this.set({
        email: email
      });
    },

    $updatePassword: function(password) {
      this.set({
        password: password
      });
    },

    $setLoginInFlight: function(isInFlight) {
      this.set({
        loginInFlight: isInFlight
      });
    },

    $setShouldRenderLoginPage: function(value) {
      this.set({
        shouldRenderLoginPage: value
      });
    },

    isLoginInFlight: function() {
      return this.get('loginInFlight');
    },

    getEmail: function() {
      return this.get('email');
    },

    getPassword: function() {
      return this.get('password');
    },

    getShouldRenderLoginPage: function() {
      return this.get('shouldRenderLoginPage');
    }

});

module.exports = loginStore;
