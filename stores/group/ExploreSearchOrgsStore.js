'use strict';

var Unicycle = require('../../Unicycle');

var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');

var PAGE_SIZE = 50;

var exploreSearchOrgsStore = Unicycle.createStore({

  init: function() {
    this.set({
      searchText: '',
      groups: [],
      offset: 0,
      moreResults: false,
      isInitialPageLoading: false,
      isLoading: false
    });
  },

  fetchSearchResults: function() {
    var currentGroups = this.getGroups(),
        offset = this.getOffset(),
        that = this;

    if (this.getSearchText().length === 0) {
      return;
    }

    if (this.getOffset() === 0) {
      this.set({
        isInitialPageLoading: true,
        groups: []
      });
    }
    else {
      this.set({
        isLoading: true
      });
    }

    AjaxUtils.ajax(
      '/search/fetchGroups',
      {
        searchTerm: this.getSearchText(),
        networkSchoolName: userLoginMetadataStore.getNetworkName(),
        maxUsersToFetch: PAGE_SIZE,
        fetchOffsetAmount: this.getOffset()
      },
      (res) => {
        var groups = res.body.groups;

        that.set({
          groups: currentGroups.concat(groups),
          moreResults: res.body.moreResults,
          offset: offset + PAGE_SIZE,
          isInitialPageLoading: false,
          isLoading: false
        });
      },
      () => {
        that.set({
          isInitialPageLoading: false,
          isLoading: false
        });
      }
    );
  },

  isInitialPageLoading: function() {
    return this.get('isInitialPageLoading');
  },

  isLoading: function() {
    return this.get('isLoading');
  },
  
  setGroups: function(value) {
    this.set({
      groups: value
    })
  },

  setSearchText: function(value) {
    this.set({
      searchText: value,
      offset: 0
    })
  },

  getSearchText: function() {
    return this.get('searchText');
  },

  getGroups: function() {
    return this.get('groups').toJSON();
  },

  getOffset: function() {
    return this.get('offset');
  },

  getMoreResults: function() {
    return this.get('moreResults');
  }

});

module.exports = exploreSearchOrgsStore;
