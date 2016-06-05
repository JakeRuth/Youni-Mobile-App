'use strict';

var React = require('react-native');
var Unicycle = require('./../Unicycle');

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

  setIsCreateAccountRequestInFlightt: function(value) {
    this.set({
      isLoginRequestInFlight: value
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
