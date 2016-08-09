'use strict';

var React = require('react-native');
var immutable = require('immutable');
var Unicycle = require('../../Unicycle');

var TrendingFeedFilters = require('../../Utils/Enums/TrendingFeedFilters');
var TrendingFeedType = require('../../Utils/Enums/TrendingFeedType');
var UserUtils = require('../../Utils/User/UserUtils');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');

var trendingStore = Unicycle.createStore({

  init: function () {
    this.set({
      isTrendingUserRequestInFlight: true,
      isTrendingGroupRequestInFlight: true,
      users: [],
      groups: [],
      pageLoadError: false,
      selectedFilter: TrendingFeedFilters.NOW,
      selectedType: TrendingFeedType.STUDENTS
    });
  },

  requestTrendingUsers: function () {
    var that = this;

    this.set({
      isTrendingUserRequestInFlight: true
    });

    AjaxUtils.ajax(
      '/trending/hackedTestCampusUser',
      {},
      (res) => {
        that.set({
          users: immutable.List(UserUtils.convertResponseUserListToMap(res.body.users)),
          isTrendingUserRequestInFlight: false,
          pageLoadError: false
        });
      },
      () => {
        that.set({
          isTrendingUserRequestInFlight: false,
          pageLoadError: true
        });
      }
    );
  },

  requestTrendingGroups: function () {
    var that = this;

    this.set({
      isTrendingGroupRequestInFlight: true
    });

    AjaxUtils.ajax(
      '/trending/hackedTestCampusGroup',
      {},
      (res) => {
        that.set({
          groups: res.body.groups,
          isTrendingGroupRequestInFlight: false,
          pageLoadError: false
        });
      },
      () => {
        that.set({
          isTrendingGroupRequestInFlight: false,
          pageLoadError: true
        });
      }
    );
  },
  
  setSelectedFilter: function(filter){
    this.set({
      selectedFilter: filter
    });
  },
  
  setSelectedType: function(type) {
    this.set({
      selectedType: type
    });
  },

  anyErrorsLoadingPage: function () {
    return this.get('pageLoadError');
  },

  isTrendingUserRequestInFlight: function () {
    return this.get('isTrendingUserRequestInFlight');
  },

  isTrendingGroupRequestInFlight: function() {
    return this.get('isTrendingGroupRequestInFlight');
  },

  getTrendingUsers: function () {
    return this.get('users');
  },
  
  getTrendingGroups: function() {
    return this.get('groups');
  },
  
  getSelectedFilter: function() {
    return this.get('selectedFilter');
  },
  
  getSelectedType: function() {
    return this.get('selectedType').toJSON();
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
