'use strict';

var React = require('react-native');
var Unicycle = require('./../Unicycle');

var searchStore = Unicycle.createStore({

  init: function() {
    this.set({
      activeSearch: false,
      results: []
    });
  },

  $updateActiveSearch: function(isActive) {
    if (isActive) {
      this.set({
        results: this._getFakeSearchResults()
      });
    }
    else {
      this.set({
        results: []
      });
    }
    this.set({
      activeSearch: isActive
    });
  },

  getActiveSearch: function() {
    return this.get('activeSearch');
  },

  getSearchResults: function() {
    return this.get('results');
  },

  _getFakeSearchResults() {
    var results = [];
    for (var i = 0; i < 20; i++) {
      results.push({
        firstName: this._getFakeName(),
        lastName: '',
        email: 'fake@email.com'
      });
    }
    return results;
  },

  _getFakeName() {
    var randomIndex = Math.floor(Math.random() * 6);
    var randomNames = ['Jake Ruth', 'Jordan DiLapo', 'Esca IdkUrLastName', 'Your Mom!', 'Flirtacious Female', 'Heee Man Grr'];
    return randomNames[randomIndex];
  }

});

module.exports = searchStore;
