'use strict';

var React = require('react-native');
var Unicycle = require('../Unicycle');
var AjaxUtils = require('../Utils/Common/AjaxUtils');
var UserUtils = require('../Utils/User/UserUtils');

var searchStore = Unicycle.createStore({

  init: function() {
    this.set({
      results: [],
      isRequestInFlight: false,
      inExploreFeedView: true
    });
  },

  resetSearchPageAfterBlockingUser: function () {
    this.set({
      results: []
    });
  },

  $executeSearch: function(search, email) {
    var results = [];
    var that = this;

    this.set({
      inExploreFeedView: false
    });

    if (search) {
      this.set({
        isRequestInFlight: true
      });

      AjaxUtils.ajax(
        '/search/users',
        {
          searchString: search,
          requestingUserEmail: email
        },
        (res) => {
          that.set({
            isRequestInFlight: false,
            results: UserUtils.convertResponseUserListToMap(res.body.users)
          });
        },
        () => {
          that.set({
            isRequestInFlight: false
          });
        }
      );
     }
     else {
       this.set({
         results: [],
         requestInFlight: false,
         inExploreFeedView: true
       });
     }
  },

  $setInExploreFeedView: function(value) {
    this.set({
      inExploreFeedView: value
    });
  },

  $setSearchResults: function(results) {
    this.set({
      results: results
    });
  },

  isRequestInFlight: function() {
    return this.get('isRequestInFlight');
  },

  getSearchResults: function() {
    return this.get('results');
  },

  getInExploreFeedView: function() {
    return this.get('inExploreFeedView');
  }

});

module.exports = searchStore;
