'use strict';

var Unicycle = require('../../Unicycle');

var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');

var MIN_ORGS_TO_DISPLAY_ON_EXPLORE_PAGE = 5;
var MAX_ORGS_TO_DISPLAY_ON_EXPLORE_PAGE = 10;

var exploreFeedOrgsStore = Unicycle.createStore({

  init: function() {
    this.set({
      groupsOnExplorePage: [],
      mostRecentGroups: [],
      allGroups: [],
      mostRecentGroupsOffset: 0,
      mostRecentGroupsMax: 0,
      allGroupsOffset: 0,
      allGroupsMax: 0,
      isGroupsOnExploreLoading: true
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

  isGroupsOnExploreLoading: function() {
    return this.get('isGroupsOnExploreLoading');
  },
  
  getGroupsOnExplorePage: function() {
    return this.get('groupsOnExplorePage').toJSON();
  }
    

});

module.exports = exploreFeedOrgsStore;
