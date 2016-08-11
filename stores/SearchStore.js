'use strict';

var immutable = require('immutable');
var Unicycle = require('../Unicycle');

var userLoginMetadataStore = require('../stores/UserLoginMetadataStore');
var AjaxUtils = require('../Utils/Common/AjaxUtils');
var UserUtils = require('../Utils/User/UserUtils');
var SearchType = require('../Utils/Enums/SearchType');

var searchStore = Unicycle.createStore({

  init: function() {
    this.set({
      searchType: SearchType.STUDENTS,
      isInitialSearchPageLoading: false,
      pageOffset: 0,
      pageSize: 35,
      isFetchingMoreResults: false,
      moreResults: false,
      searchTerm: '',
      results: [],
      inExploreFeedView: true
    });
  },
  
  executeSearch: function(email, searchType) {
    if (this.getSearchTerm()) {
      this.set({
        results: [],
        inExploreFeedView: false,
        isInitialSearchPageLoading: true,
        pageOffset: 0
      });
      
      if (searchType) {
        this.set({
          searchType: searchType
        });
      }

      if (this.getSearchType() === SearchType.STUDENTS) {
        this._executeUserSearch(email);
      }
      else {
        this._executeGroupSearch();
      }
    }
    else {
      this.set({
        inExploreFeedView: true
      });
    }
  },

  fetchNextPage: function(email, callback) {
    if (!this.moreResultsToFetch()) {
      return;
    }

    this.set({
      isFetchingMoreResults: true
    });

    if (this.getSearchType() === SearchType.STUDENTS) {
      this._executeUserSearch(email, callback);
    }
    else {
      this._executeGroupSearch(callback);
    }
  },

  _executeUserSearch: function(email, callback) {
    var currentResults = this.get('results'),
        that = this;

    AjaxUtils.ajax(
      '/search/fetchUsers',
      {
        searchTerm: that.getSearchTerm(),
        requestingUserEmail: email,
        maxUsersToFetch: that.getPageSize(),
        fetchOffsetAmount: that.getPageOffset()
      },
      (res) => {
        var results = immutable.List(UserUtils.convertResponseUserListToMap(res.body.users));

        if (currentResults.size) {
          results = currentResults.concat(results);
        }

        that.set({
          isInitialSearchPageLoading: false,
          isFetchingMoreResults: false,
          moreResults: res.body.moreResults,
          pageOffset: that.getPageOffset() + that.getPageSize(),
          results: results
        });

        if (callback) {
          callback(results);
        }
      },
      () => {
        that.set({
          isInitialSearchPageLoading: false,
          isFetchingMoreResults: false
        });
      }
    );
  },

  _executeGroupSearch: function(callback) {
    var currentResults = this.get('results'),
        that = this;

    AjaxUtils.ajax(
      '/search/fetchGroups',
      {
        searchTerm: that.getSearchTerm(),
        networkSchoolName: userLoginMetadataStore.getNetworkName(),
        maxUsersToFetch: that.getPageSize(),
        fetchOffsetAmount: that.getPageOffset()
      },
      (res) => {
        var results = immutable.List(res.body.groups);

        if (currentResults.size) {
          results = currentResults.concat(results);
        }

        that.set({
          isInitialSearchPageLoading: false,
          isFetchingMoreResults: false,
          moreResults: res.body.moreResults,
          pageOffset: that.getPageOffset() + that.getPageSize(),
          results: results
        });

        if (callback) {
          callback(results);
        }
      },
      () => {
        that.set({
          isInitialSearchPageLoading: false,
          isFetchingMoreResults: false
        });
      }
    );
  },

  resetSearchResults: function () {
    this.set({
      results: []
    });
  },

  setSearchType: function(searchType) {
    this.set({
      searchType: searchType
    });
  },

  setInExploreFeedView: function(value) {
    this.set({
      inExploreFeedView: value
    });
  },

  setSearchTerm: function(value) {
    this.set({
      searchTerm: value
    });
  },

  isFirstPageOfResultsLoading: function() {
    return this.get('isInitialSearchPageLoading');
  },

  isFetchingMoreResults: function() {
    return this.get('isFetchingMoreResults');
  },

  getSearchResults: function() {
    var resultList = [],
        immutableJsResults = this.get('results');

    if (!immutableJsResults) return;

    for (var i = 0; i < immutableJsResults.size; i++) {
      resultList.push(immutableJsResults.get(i));
    }

    return resultList;
  },

  getNumResults: function() {
    var results = this.getSearchResults();
    if (results) {
      return results.length;
    }
    else {
      return 0;
    }
  },

  getSearchType: function() {
    return this.get('searchType');
  },

  getSearchTerm: function() {
    return this.get('searchTerm');
  },

  getInExploreFeedView: function() {
    return this.get('inExploreFeedView');
  },

  getPageSize: function() {
    return this.get('pageSize');
  },

  getPageOffset: function() {
    return this.get('pageOffset');
  },

  moreResultsToFetch: function() {
    return this.get('moreResults');
  }

});

module.exports = searchStore;
