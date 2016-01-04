'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var immutable = require('immutable');
var TrendingUtils = require('../../Utils/Trending/TrendingUtils');

var trendingStore = Unicycle.createStore({

    init: function () {
      this.set({
        isTrendingRequestInFlight: true,
        users: [],
        pageLoadError: false
      });
    },

    $getTrendingUsers: function() {
      var that = this;

      TrendingUtils.ajax(
        '/trending/getTopUsers',
        (res) => {
          that.set({
            users: immutable.List(
                TrendingUtils.generateTrendingUserInfo(res.body.users)
            ),
            isTrendingRequestInFlight: false,
            pageLoadError: false
          });
        },
        () => {
          that.set({
            isTrendingRequestInFlight: false,
            pageLoadError: true
          });
        }
      );
    },

    anyErrorsLoadingPage: function() {
      return this.get('pageLoadError');
    },

    isRequestInFlight: function() {
      return this.get('isTrendingRequestInFlight');
    },

    getTrendingUsers: function() {
      return this.get('users');
    }

});

module.exports = trendingStore;
