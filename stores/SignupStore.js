'use strict';

var Unicycle = require('../Unicycle');
var AjaxUtils = require('../Utils/Common/AjaxUtils');
var Gender = require('../Utils/Enums/Gender');
var LoginSignupFlowAlerts = require('../Components/LoginSignupFlow/LoginSignupFlowAlerts');

var signupStore = Unicycle.createStore({

  init: function () {
    this.set({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      gender: '',
      classYear: '',
      isCreateAccountRequestInFlight: false
    });
  },

  createUser: function(successCallback) {
    var isFemale = this.getGender() === Gender.FEMALE,
        that = this;

    this.setIsCreateAccountRequestInFlight(true);

    AjaxUtils.ajax(
      '/user/create',
      {
        firstName: this.getFirstName(),
        lastName: this.getLastName(),
        email: this.getEmail(),
        password: this.getPassword(),
        isFemale: isFemale,
        classYear: this.getClassYear()
      },
      (res) => {
        that.setIsCreateAccountRequestInFlight(false);

        if (res.body.addedToWaitList) {
          LoginSignupFlowAlerts.addedToWaitlist(res.body.message);
        }
        else if (res.body.emailAlreadyInUse) {
          LoginSignupFlowAlerts.emailAlreadyInUse(res.body.message);
        }
        else if (res.body.success) {
          successCallback();
        }
      },
      () => {
        that.setIsCreateAccountRequestInFlight(false);
        LoginSignupFlowAlerts.signupError();
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

  setConfirmPassword: function(confirmPassword) {
    this.set({
      confirmPassword: confirmPassword
    });
  },

  setFirstName: function(firstName) {
    this.set({
      firstName: firstName
    });
  },

  setLastName: function(lastName) {
    this.set({
      lastName: lastName
    });
  },

  setGender: function(gender) {
    this.set({
      gender: gender
    });
  },

  setClassYear: function(classYear) {
    this.set({
      classYear: classYear
    });
  },

  setIsCreateAccountRequestInFlight: function(value) {
    this.set({
      isCreateAccountRequestInFlight: value
    });
  },

  isCreateAccountRequestInFlight: function() {
    return this.get('isCreateAccountRequestInFlight');
  },

  getEmail: function() {
    return this.get('email');
  },

  getPassword: function() {
    return this.get('password');
  },

  getConfirmPassword: function() {
    return this.get('confirmPassword');
  },

  getFirstName: function() {
    return this.get('firstName');
  },

  getLastName: function() {
    return this.get('lastName');
  },

  getGender: function() {
    return this.get('gender');
  },

  getClassYear: function() {
    return this.get('classYear');
  }

});

module.exports = signupStore;
