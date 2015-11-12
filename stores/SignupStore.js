'use strict';

var React = require('react-native');
var Unicycle = require('./../Unicycle');

var signupStore = Unicycle.createStore({

    init: function () {
      this.set({
        //email: 'Enter your email',
        //password: '',
        //loginInFlight: false,
        onWayToSignupInFlight: false
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

    $setOnWayToSignupInFlight: function(isInFlight) {
      this.set({
        onWayToSignupInFlight: isInFlight
      });
    },

    isOnWayToSignupInFlight: function() {
      return this.get('onWayToSignupInFlight');
    },

    getEmail: function() {
      return this.get('email');
    },

    getFirstName: function(){
      return this.get('');
    },

    getLastName: function(){
      return this.get('');
    },

    getPassword: function() {
      return this.get('password');
    }

});

module.exports = signupStore;
