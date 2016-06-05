'use strict';

var React = require('react-native');
var Unicycle = require('./../Unicycle');

var loginStore = Unicycle.createStore({

  init: function () {
    this.set({
      email: '',
      password: '',
      isLoginRequestInFlight: false
    });
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
