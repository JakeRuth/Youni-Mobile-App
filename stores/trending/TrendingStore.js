'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var immutable = require('immutable');
var UserUtils = require('../../Utils/User/UserUtils');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');

var trendingStore = Unicycle.createStore({

  init: function () {
    this.set({
      isTrendingRequestInFlight: true,
      weeklyUsers: [],
      currentUsers: [],
      allTimeUsers: [],
      pageLoadError: false
    });
  },

  $getTrendingUsers: function () {
    var that = this;

    this.set({
      isTrendingRequestInFlight: true
    });

    AjaxUtils.ajax(
      '/trending/getTopUsers',
      {},
      (res) => {
        that.set({
          weeklyUsers: immutable.List(UserUtils.convertResponseUserListToMap(res.body.users)),
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

  $getCurrentTrendingUsers: function () {
    var that = this;

    this.set({
      isTrendingRequestInFlight: true
    });

    AjaxUtils.ajax(
      '/trending/getCurrentTrendingUsers',
      {},
      (res) => {
        that.set({
          currentUsers: immutable.List(UserUtils.convertResponseUserListToMap(res.body.users)),
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

  $getAllTimeTrendingUsers: function () {
    var that = this;

    this.set({
      isTrendingRequestInFlight: true
    });

    AjaxUtils.ajax(
      '/trending/getTopUsersAllTime',
      {},
      (res) => {
        var users = UserUtils.convertResponseUserListToMap(res.body.users);

        that._copyAllTimePointsToCurrentPoints(users);

        that.set({
          allTimeUsers: immutable.List(users),
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

  anyErrorsLoadingPage: function () {
    return this.get('pageLoadError');
  },

  isRequestInFlight: function () {
    return this.get('isTrendingRequestInFlight');
  },

  getCurrentTrendingUsers: function () {
    return this.get('currentUsers');
  },

  getWeeklyTrendingUsers: function () {
    return this.get('weeklyUsers');
  },

  getAllTimeTrendingUsers: function () {
    return this.get('allTimeUsers');
  },

  // TODO: Find a better way to do this, at the time this was all i could come up with :'(
  // This is because the TrendingUserList component passes user.currentPoints, and I didn't
  // want to mess up that code, so I hid it here
  _copyAllTimePointsToCurrentPoints: function(users) {
    for (var i = 0; i < users.length; i++) {
      users[i].currentPoints = users[i].totalPoints;
    }
  }

});

module.exports = trendingStore;
