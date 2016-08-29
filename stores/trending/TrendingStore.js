'use strict';

var immutable = require('immutable');
var Unicycle = require('../../Unicycle');

var TrendingFeedFilters = require('../../Utils/Enums/TrendingFeedFilters');
var TrendingFeedType = require('../../Utils/Enums/TrendingFeedType');
var UserUtils = require('../../Utils/User/UserUtils');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');

var userLoginMetadataStore = require('../UserLoginMetadataStore');

var trendingStore = Unicycle.createStore({

  init: function () {
    this.set({
      isTrendingUserRequestInFlight: true,
      isTrendingGroupRequestInFlight: true,
      users: [],
      groups: [],
      selectedFilter: TrendingFeedFilters.SEMESTER,
      selectedType: TrendingFeedType.ORGANIZATIONS
    });
  },

  requestTrendingUsers: function () {
    var that = this;

    this.set({
      isTrendingUserRequestInFlight: true
    });

    AjaxUtils.ajax(
      '/trending/getTrendingUsers',
      {
        networkName: userLoginMetadataStore.getNetworkName()
      },
      (res) => {
        that.set({
          users: immutable.List(UserUtils.convertResponseUserListToMap(res.body.users)),
          isTrendingUserRequestInFlight: false
        });
      },
      () => {
        that.set({
          isTrendingUserRequestInFlight: false
        });
      }
    );
  },

  requestSemesterTrendingUsers: function () {
    var that = this;

    this.set({
      isTrendingUserRequestInFlight: true
    });

    AjaxUtils.ajax(
      '/trending/getSemesterTrendingUsers',
      {
        networkName: userLoginMetadataStore.getNetworkName()
      },
      (res) => {
        that.set({
          users: immutable.List(UserUtils.convertResponseUserListToMap(res.body.users)),
          isTrendingUserRequestInFlight: false
        });
      },
      () => {
        that.set({
          isTrendingUserRequestInFlight: false
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
      '/trending/getTrendingGroups',
      {
        networkName: userLoginMetadataStore.getNetworkName()
      },
      (res) => {
        that.set({
          groups: res.body.groups,
          isTrendingGroupRequestInFlight: false
        });
      },
      () => {
        that.set({
          isTrendingGroupRequestInFlight: false
        });
      }
    );
  },

  requestSemesterTrendingGroups: function () {
    var that = this;

    this.set({
      isTrendingGroupRequestInFlight: true
    });

    AjaxUtils.ajax(
      '/trending/getSemesterTrendingGroups',
      {
        networkName: userLoginMetadataStore.getNetworkName()
      },
      (res) => {
        that.set({
          groups: res.body.groups,
          isTrendingGroupRequestInFlight: false
        });
      },
      () => {
        that.set({
          isTrendingGroupRequestInFlight: false
        });
      }
    );
  },
  
  setSelectedFilter: function(filter) {
    var currentFilter = this.getSelectedFilter();

    if (filter === currentFilter) {
      return;
    }

    this.set({
      selectedFilter: filter
    });

    this.requestFeedForCurrentSelection();
  },
  
  setSelectedType: function(type) {
    this.set({
      selectedType: type
    });

    this.requestFeedForCurrentSelection();
  },

  isTrendingUserRequestInFlight: function() {
    return this.get('isTrendingUserRequestInFlight');
  },

  isTrendingGroupRequestInFlight: function() {
    return this.get('isTrendingGroupRequestInFlight');
  },

  getTrendingUsers: function() {
    return this.get('users');
  },
  
  getTrendingGroups: function() {
    return this.get('groups');
  },
  
  getSelectedFilter: function() {
    return this.get('selectedFilter');
  },
  
  getSelectedType: function() {
    return this.get('selectedType');
  },

  // TODO: Find a better way to do this, at the time this was all i could come up with :'(
  // This is because the TrendingUserList component passes user.currentPoints, and I didn't
  // want to mess up that code, so I hid it here
  _copyAllTimePointsToCurrentPoints: function(users) {
    for (var i = 0; i < users.length; i++) {
      users[i].currentPoints = users[i].totalPoints;
    }
  },

  requestFeedForCurrentSelection: function() {
    if (this.getSelectedType() === TrendingFeedType.STUDENTS) {
      if (this.getSelectedFilter() === TrendingFeedFilters.NOW) {
        this.requestTrendingUsers();
      }
      else {
        this.requestSemesterTrendingUsers();
      }
    }
    else {
      if (this.getSelectedFilter() === TrendingFeedFilters.NOW) {
        this.requestTrendingGroups();
      }
      else {
        this.requestSemesterTrendingGroups();
      }
    }
  }

});

module.exports = trendingStore;
