'use strict';

var React = require('react-native');
var Unicycle = require('./../Unicycle');

var userLoginMetadata = Unicycle.createStore({

    init: function () {
      this.set({
        accessToken: '',
        refreshToken: '',
        userId: '',
        email: ''
      });
    },

    $setAllMetadata: function (accessToken, refreshToken, userId, email) {
      this.set({
        accessToken: accessToken,
        refreshToken: refreshToken,
        userId: userId,
        email: email
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
    }

});

module.exports = userLoginMetadata;
