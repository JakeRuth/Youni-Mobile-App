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
        lastName: '',
        networkName: ''
      });
    },

    $setAllMetadata: function (accessToken, refreshToken, userId, email, firstName, lastName, networkName) {
      this.set({
        accessToken: accessToken,
        refreshToken: refreshToken,
        userId: userId,
        email: email,
        firstName: firstName,
        lastName: lastName,
        networkName: networkName
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
    },

    getFullName: function() {
      return this.getFirstName() + ' ' + this.getLastName();
    },

    getNetworkName: function() {
      return this.get('networkName');
    }

});

module.exports = userLoginMetadata;
