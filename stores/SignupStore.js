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
        onWayToSignupInFlight: false,
        inSignUpView: false,
        isInLoginView: false,
        signUpInFlight: false,
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

    $setSignupInFlight: function(isInFlightStatus) {
      this.set({
        signUpInFlight: isInFlightStatus
      });
    },

    isSignupInFlight: function() {
      return this.get('signUpInFlight');
    },

    $setInSignUpView: function(isInFlight) {
      this.set({
        inSignUpView: isInFlight
      });
    },

    isInSignUpView: function() {
      return this.get('inSignUpView');
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
