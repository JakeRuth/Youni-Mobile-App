'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');

var signUpStore = Unicycle.createStore({

    init: function () {
      this.set({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        sex: null,
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
          password = this.getSignupPassword(),
          sex = this.getSex();

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

      AjaxUtils.ajax(
        '/user/create',
        {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
          isFemale: sex === 'female',
          schoolName: 'SUNY Albany' //TODO fix me
        },
        (res) => {
          //hacky fix to get this to fail if the network isn't recognized by email extension
          //aka: "We aren't open for your school yet"
          if (res.body.success) {
            that.set({
              signUpRequestSuccessful: true,
              isSignUpRequestUpInFlight: false,
              setInLoginView: true,
              setInSignUpView: false,
              pageLoadError: false
            });
          }
          else {
            that.set({
              pageLoadError: true,
              isSignUpRequestUpInFlight: false
            });
          }
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

    $signUpUpdateSex: function(sex) {
      this.set({
        sex: sex
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

    setPageLoadError: function(value) {
      this.set({
        pageLoadError: value
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

    getSex: function() {
      return this.get('sex');
    },

    getSignUpRequestSuccessful: function() {
      return this.get('signUpRequestSuccessful');
    }

});

module.exports = signUpStore;
