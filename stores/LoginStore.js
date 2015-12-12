'use strict';

var React = require('react-native');
var Unicycle = require('./../Unicycle');

var loginStore = Unicycle.createStore({

    init: function () {
      this.set({
        email: 'Enter your email',
        password: '',
        loginInFlight: false
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

    isLoginInFlight: function() {
      return this.get('loginInFlight');
    },

    getEmail: function() {
      return this.get('email');
    },

    getPassword: function() {
      return this.get('password');
    }

});

module.exports = loginStore;
