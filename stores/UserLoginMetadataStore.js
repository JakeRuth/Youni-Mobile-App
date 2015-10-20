'use strict';

var React = require('react-native');
var Unicycle = require('./../Unicycle');

var userLoginMetadata = Unicycle.createStore({

    init: function () {
      this.set({
        accessToken: '',
        refreshToken: '',
        userId: ''
      });
    },

    $setAllMetadata: function (accessToken, refreshToken, userId) {
      this.set({
        accessToken: accessToken,
        refreshToken: refreshToken,
        userId: userId
      });
    },

    getAccessToken: function() {
      this.get('accessToken');
    },

    getRefreshToken: function() {
      this.get('refreshToken');
    },

    getUserId: function() {
      this.get('userId');
    }

});

module.exports = userLoginMetadata;
