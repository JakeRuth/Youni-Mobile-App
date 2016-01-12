'use strict';

var React = require('react-native');
var Unicycle = require('./../Unicycle');

var userLoginMetadata = Unicycle.createStore({

    init: function () {
      this.set({
        accessToken: '',
        refreshToken: '',
        userId: '',
        email: '',
        firstName: '',
        lastName: ''
      });
    },

    $setAllMetadata: function (accessToken, refreshToken, userId, email, firstName, lastName) {
      this.set({
        accessToken: accessToken,
        refreshToken: refreshToken,
        userId: userId,
        email: email,
        firstName: firstName,
        lastName: lastName
      });
    },

    setFirstName: function(value) {
      this.set({
        firstName: value
      });
    },

    setLastName: function(value) {
      this.set({
        lastName: value
      });
    },

    getAccessToken: function() {
      return this.get('accessToken');
    },

    getRefreshToken: function() {
      return this.get('refreshToken');
    },

    getUserId: function() {
      return this.get('userId');
    },

    getEmail: function() {
      return this.get('email');
    },

    getFirstName: function() {
      return this.get('firstName');
    },

    getLastName: function() {
      return this.get('lastName');
    }

});

module.exports = userLoginMetadata;
