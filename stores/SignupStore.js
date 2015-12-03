'use strict';

var React = require('react-native');
var Unicycle = require('./../Unicycle');
var signupStore = Unicycle.createStore({

    init: function () {
      this.set({
        firstName: 'First Name',
        lastName: 'Last Name',
        collegeCampus: 'Seach Your College',
        email: 'Enter your email',
        password: '',
        confirmPassword: '',
        //loginInFlight: false,
        onWayToSignupInFlight: false,
        signupRequestInFlight: false,
      });
    },


    $signup: function (firstname, lastname, username, password) {
      this.set({
        firstName: firstname,
        lastName: lastname,
        email: username,
        password: password
      });
    },


    $signupUpdateFirstName: function(firstname){
      this.set({
        firstName: firstname
      });
    },

    $signupUpdateLastName: function(lastname){
      this.set({
        lastName: lastname
      });
    },

    $signupUpdateEmail: function(email) {
      this.set({
        email: email
      });
    },

    $signupUpdatePassword: function(password) {
      this.set({
        password: password
      });
    },

    $signupUpdateConfirmPassword: function(confirmPassword) {
      this.set({
        confirmPassword: confirmPassword
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

    $setSignUpRequestedPage: function(isInFlight) {
      this.set({
        signupRequestInFlight: isInFlight
      });
    },

    isSignUpRequestedPage: function() {
      return this.get('signupRequestInFlight');
    },

    getSignupEmail: function() {
      return this.get('email');
    },

    getSignupFirstName: function(){
      return this.get('firstName');
    },

    getSignupLastName: function(){
      return this.get('lastName');
    },

    getSignupPassword: function() {
      return this.get('password');
    },

    getSignupConfirmPassword: function(){
      return this.get('confirmPassword');
    },


});

module.exports = signupStore;
