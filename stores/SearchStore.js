'use strict';

var React = require('react-native');
var immutable = require('immutable');
var Unicycle = require('../Unicycle');
var AjaxUtils = require('../Utils/Common/AjaxUtils');
var UserUtils = require('../Utils/User/UserUtils');

var searchStore = Unicycle.createStore({

  init: function() {
    this.set({
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
  
  executeSearch: function(email) {
    if (this.getSearchTerm()) {
      this.set({
        results: [],
        inExploreFeedView: false,
        isInitialSearchPageLoading: true,
        pageOffset: 0
      });

      this._requestSearch(email);
    }
    else {
      this.set({
        inExploreFeedView: true
      });
    }
  },

  fetchNextPage: function(email, callback) {
    if (this.moreResultsToFetch()) {
      this.set({
        isFetchingMoreResults: true
      });
      this._requestSearch(email, callback);
    }
  },

  _requestSearch: function(email, callback) {
    var currentResults = this.get('results'),
        that = this;

    AjaxUtils.ajax(
      '/search/fetchUsers',
      {
        searchTerm: that.getSearchTerm(),
        requestingUserEmail: email,
        maxUsersToFetch: that.getPageSize(),
        fetchOffsetAmount: that.get('pageOffset')
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
          pageOffset: that.get('pageOffset') + that.getPageSize(),
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

  resetSearchPageAfterBlockingUser: function () {
    this.set({
      results: []
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

  getSearchTerm: function() {
    return this.get('searchTerm');
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

  getInExploreFeedView: function() {
    return this.get('inExploreFeedView');
  },

  getPageSize: function() {
    return this.get('pageSize');
  },

  moreResultsToFetch: function() {
    return this.get('moreResults');
  }

});

module.exports = searchStore;
