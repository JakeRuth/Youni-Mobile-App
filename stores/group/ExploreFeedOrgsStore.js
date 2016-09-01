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
      moreAllGroupsToFetch: false,
      isGroupsOnExploreLoading: true,
      isFetchingMoreRecentGroupsLoading: false,
      isInitialFetchAllGroupsPageLoading: false,
      isFetchingAllGroupsLoading: false,
      currentFilter: ExploreGroupFilters.RECENT
    });
  },
  
  resetState: function() {
    this.set({
      mostRecentGroups: [],
      allGroups: [],
      mostRecentGroupsOffset: 0,
      moreMostRecentGroupsToFetch: false,
      allGroupsOffset: 0,
      moreAllGroupsToFetch: false,
      isGroupsOnExploreLoading: true,
      isFetchingMoreRecentGroupsLoading: false,
      isInitialFetchAllGroupsPageLoading: false,
      isFetchingAllGroupsLoading: false
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

  fetchAllOrgsAlphabetically: function() {
    var currentGroups = this.getAllAlphabeticalGroups(),
        currentOffset = this.get('allGroupsOffset'),
        that = this;

    if (currentOffset === 0) {
      this.set({
        isInitialFetchAllGroupsPageLoading: true
      });
    }
    else {
      this.set({
        isFetchingAllGroupsLoading: true
      });
    }

    AjaxUtils.ajax(
      '/group/fetchAlphabetically',
      {
        networkSchoolName: userLoginMetadataStore.getNetworkName(),
        offset: currentOffset,
        max: PAGE_SIZE
      },
      (res) => {
        that.set({
          allGroups: currentGroups.concat(res.body.groups),
          allGroupsOffset: currentOffset + PAGE_SIZE,
          moreAllGroupsToFetch: res.body.moreToFetch,
          isInitialFetchAllGroupsPageLoading: false,
          isFetchingAllGroupsLoading: false
        });
      },
      () => {
        that.set({
          isInitialFetchAllGroupsPageLoading: false,
          isFetchingAllGroupsLoading: false
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

  isInitialFetchAllGroupsPageLoading: function() {
    return this.get('isInitialFetchAllGroupsPageLoading');
  },

  isFetchingAllGroupsLoading: function() {
    return this.get('isFetchingAllGroupsLoading');
  },
  
  getGroupsOnExplorePage: function() {
    return this.get('groupsOnExplorePage').toJSON();
  },
  
  getMostRecentGroups: function() {
    return this.get('mostRecentGroups').toJSON();
  },

  getAllAlphabeticalGroups: function() {
    return this.get('allGroups').toJSON();
  },
  
  getMoreMostRecentGroupsToFetch: function() {
    return this.get('moreMostRecentGroupsToFetch');
  },
  
  getMoreAllGroupsToFetch: function() {
    return this.get('moreAllGroupsToFetch');
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
