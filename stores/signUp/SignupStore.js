'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var request = require('superagent');
var prefix = require('superagent-prefix')('http://greedyapi.elasticbeanstalk.com');

var signUpStore = Unicycle.createStore({

    init: function () {
      this.set({
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Enter your email',
        password: '',
        confirmPassword: '',
        inSignUpView: false,
        isSignUpRequestUpInFlight: false,
        signUpRequestSuccessful: false
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
        isSignUpRequestUpInFlight: true
      });

      request
        .post('/user/create')
        .use(prefix)
        .send({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            schoolName: 'SUNY Albany' //TODO fix me
          })
        .set('Accept', 'application/json')
        .end(function(err, res) {
          console.log(res.body)
          if ((res !== undefined) && (res.ok) && (res.body.success)) {
            that.set({
              signUpRequestSuccessful: true,
              isSignUpRequestUpInFlight: false,
              setInLoginView: true,
              setInSignUpView: false
            });
          }
          //TODO: implement fail case
          else {
            that.set({
              isSignUpRequestUpInFlight: false
            });
          }
        });
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
