'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var SignupUtils = require('../../Utils/Signup/SignupUtils');

var signUpStore = Unicycle.createStore({

    init: function () {
      this.set({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        inSignUpView: false,
        isSignUpRequestUpInFlight: false,
        signUpRequestSuccessful: false,
        pageLoadError: false
      });
    },

    $onSignUpRequest: function() {
      var that = this,
          firstName = this.getSignupFirstName(),
          lastName = this.getSignupLastName(),
          email = this.getSignupEmail(),
          password = this.getSignupPassword();

      //fixes weird bug where blank password field validates (cannot replicate at command line with api)
      if (!password) {
        password = '~';
      }
      if (!email) {
        email = '~';
      }

      this.set({
        isSignUpRequestUpInFlight: true,
        pageLoadError: false
      });

      SignupUtils.ajax(
        '/user/create',
        {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
          schoolName: 'SUNY Albany' //TODO fix me
        },
        () => {
          that.set({
            signUpRequestSuccessful: true,
            isSignUpRequestUpInFlight: false,
            setInLoginView: true,
            setInSignUpView: false,
            pageLoadError: false
          });
        },
        () => {
          that.set({
            isSignUpRequestUpInFlight: false,
            pageLoadError: true
          });
        }
      );
    },

    $signUpUpdateFirstName: function(firstname){
      this.set({
        firstName: firstname
      });
    },

    $signUpUpdateLastName: function(lastname){
      this.set({
        lastName: lastname
      });
    },

    $signUpUpdateEmail: function(email) {
      this.set({
        email: email
      });
    },

    $signUpUpdatePassword: function(password) {
      this.set({
        password: password
      });
    },

    $signUpUpdateConfirmPassword: function(confirmPassword) {
      this.set({
        confirmPassword: confirmPassword
      });
    },

    $setInSignUpView: function(isInFlight) {
      this.set({
        inSignUpView: isInFlight
      });
    },

    $setSignUpRequestSuccessful: function(value) {
      this.set({
        signUpRequestSuccessful: value
      });
    },

    anyErrorsLoadingPage: function() {
      return this.get('pageLoadError');
    },

    isSignUpRequestUpInFlight: function() {
      return this.get('isSignUpRequestUpInFlight');
    },

    isInSignUpView: function() {
      return this.get('inSignUpView');
    },

    getSignupEmail: function() {
      return this.get('email');
    },

    getSignupFirstName: function() {
      return this.get('firstName');
    },

    getSignupLastName: function() {
      return this.get('lastName');
    },

    getSignupPassword: function() {
      return this.get('password');
    },

    getSignupConfirmPassword: function() {
      return this.get('confirmPassword');
    },

    getSignUpRequestSuccessful: function() {
      return this.get('signUpRequestSuccessful');
    }

});

module.exports = signUpStore;
