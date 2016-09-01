'use strict';

var Unicycle = require('../../Unicycle');

var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var ExploreGroupFilters = require('../../Utils/Enums/ExploreGroupFilters');

var MIN_ORGS_TO_DISPLAY_ON_EXPLORE_PAGE = 5;
var MAX_ORGS_TO_DISPLAY_ON_EXPLORE_PAGE = 10;
var PAGE_SIZE = 50;

var exploreFeedOrgsStore = Unicycle.createStore({

  init: function() {
    this.set({
      groupsOnExplorePage: [],
      mostRecentGroups: [],
      allGroups: [],
      mostRecentGroupsOffset: 0,
      moreMostRecentGroupsToFetch: false,
      allGroupsOffset: 0,
      isGroupsOnExploreLoading: true,
      isFetchingMoreRecentGroupsLoading: false,
      currentFilter: ExploreGroupFilters.RECENT
    });
  },

  requestTenMostRecentOrgs: function() {
    var that = this;

    this.set({
      isGroupsOnExploreLoading: true
    });

    AjaxUtils.ajax(
      '/group/fetchMostRecent',
      {
        networkSchoolName: userLoginMetadataStore.getNetworkName(),
        offset: 0,
        max: MAX_ORGS_TO_DISPLAY_ON_EXPLORE_PAGE,
        min: MIN_ORGS_TO_DISPLAY_ON_EXPLORE_PAGE
      },
      (res) => {
        that.set({
          groupsOnExplorePage: res.body.groups,
          mostRecentGroups: res.body.groups,
          mostRecentGroupsOffset: res.body.groups.length,
          moreMostRecentGroupsToFetch: res.body.moreToFetch,
          isGroupsOnExploreLoading: false
        });
      },
      () => {
        that.set({
          isGroupsOnExploreLoading: false
        });
      }
    );
  },
  
  fetchMostRecentOrgs: function() {
    var currentGroups = this.getMostRecentGroups(),
        currentOffset = this.get('mostRecentGroupsOffset'),
        that = this;
    
    this.set({
      isFetchingMoreRecentGroupsLoading: true
    });

    AjaxUtils.ajax(
      '/group/fetchMostRecent',
      {
        networkSchoolName: userLoginMetadataStore.getNetworkName(),
        offset: currentOffset,
        max: PAGE_SIZE
      },
      (res) => {
        that.set({
          mostRecentGroups: currentGroups.concat(res.body.groups),
          mostRecentGroupsOffset: currentOffset + PAGE_SIZE,
          moreMostRecentGroupsToFetch: res.body.moreToFetch,
          isFetchingMoreRecentGroupsLoading: false
        });
      },
      () => {
        that.set({
          isFetchingMoreRecentGroupsLoading: false
        });
      }
    );
  },

  isGroupsOnExploreLoading: function() {
    return this.get('isGroupsOnExploreLoading');
  },

  isFetchingMoreRecentGroupsLoading: function() {
    return this.get('isFetchingMoreRecentGroupsLoading');
  },
  
  getGroupsOnExplorePage: function() {
    return this.get('groupsOnExplorePage').toJSON();
  },
  
  getMostRecentGroups: function() {
    return this.get('mostRecentGroups').toJSON();
  },
  
  getMoreMostRecentGroupsToFetch: function() {
    return this.get('moreMostRecentGroupsToFetch');
  },

  getCurrentFilter: function() {
    return this.get('currentFilter');
  },

  toggleFilter: function(newFilter) {
    var currentFilter = this.getCurrentFilter();

    if (newFilter !== currentFilter) {
      this.set({
        currentFilter: newFilter
      });
    }
  }

});

module.exports = exploreFeedOrgsStore;
