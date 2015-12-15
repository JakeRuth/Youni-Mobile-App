'use strict';

var React = require('react-native');
var Unicycle = require('./../Unicycle');
var request = require('superagent');
var prefix = require('superagent-prefix')('http://greedyapi.elasticbeanstalk.com');

var searchStore = Unicycle.createStore({

  init: function() {
    this.set({
      results: [],
      isRequestInFlight: false,
      inExploreFeedView: true,
      inProfileView: false
    });
  },

  resetSearchPageAfterBlockingUser: function () {
    this.set({
      results: [],
      inProfileView: false
    });
  },

  $executeSearch: function(search, email) {
    var results = [];
    var that = this;

    this.set({
      inExploreFeedView: false
    });

    if (search) {
      this.set({ isRequestInFlight: true });
      request
       .post('/search/users')
       .use(prefix)
       .send({
         searchString: search,
         requestingUserEmail: email
       })
       .set('Accept', 'application/json')
       .end(function(err, res) {
         if ((res !== undefined) && (res.ok)) {
           results = that._createSearchJsonFromResponse(res.body.users);
           that.set({
             isRequestInFlight: false,
             results: results
           });
         }
         else {
           //TODO: Implement a failed case
         }
       });
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

  $setInProfileView: function(value) {
    this.set({
      inProfileView: value
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
  },

  getInProfileView: function() {
    return this.get('inProfileView');
  },

  _createSearchJsonFromResponse: function(users) {
    var usersJson = [];
    if (users) {
      for (var i = 0; i < users.length; i++) {
        var user = users[i];
        usersJson.push({
          firstName: user['firstName'],
          lastName: user['lastName'],
          email: user['email'],
          profileImageUrl: user['profileImageUrl']
        });
      }
    }
    return usersJson;
  }

});

module.exports = searchStore;
