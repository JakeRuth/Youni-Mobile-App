'use strict';

var React = require('react-native');
var Unicycle = require('./../Unicycle');
var request = require('superagent');
var prefix = require('superagent-prefix')('http://localhost:8080/Greedy');

var searchStore = Unicycle.createStore({

  init: function() {
    this.set({
      results: [],
      isRequestInFlight: false
    });
  },

  $executeSearch: function(search) {
    var results = [];
    var that = this;

    if (search) {
      this.set({ isRequestInFlight: true });
      request
       .post('/search/users')
       .use(prefix)
       .send({ searchString: search })
       .set('Accept', 'application/json')
       .end(function(err, res) {
         if ((res !== undefined) && (res.ok)) {
           results = that._createSearchJsonFromResponse(res.body.users);
           that.set({
             isRequestInFlight: false,
             results: results
           });
         } else {
           //TODO: Implement a failed case
         }
       });
     }
     else {
       this.set({
         results: [],
         requestInFlight: false
       });
     }
  },

  isRequestInFlight: function() {
    return this.get('isRequestInFlight');
  },

  getSearchResults: function() {
    return this.get('results');
  },

  _createSearchJsonFromResponse: function(users) {
    var usersJson = [];
    if (users) {
      for (var i = 0; i < users.length; i++) {
        var user = users[i];
        usersJson.push({
          firstName: user['firstName'],
          lastName: user['lastName'],
          email: user['email']
        });
      }
    }
    return usersJson;
  }

});

module.exports = searchStore;
