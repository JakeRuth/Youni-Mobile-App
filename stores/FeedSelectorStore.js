'use strict';

var React = require('react-native');
var Unicycle = require('./../Unicycle');

var feedSelectorStore = Unicycle.createStore({

    FeedType: function() {
      return {
        FULL: 'full',
        ME: 'me'
      }
    },

    init: function() {
      this.set({
        currentFeed: 'full'
      });
    },

    $toggleFeed: function() {
      var currentFeed = this.getCurrentFeed();
      var nextFeed;

      Unicycle.exec('reInitializeFeedOffsets');
      if (currentFeed == 'full') {
        nextFeed = 'me';
      }
      else {
        nextFeed = 'full';
      }

      this.set({
        currentFeed: nextFeed
      });
    },

    getCurrentFeed: function() {
      return this.get('currentFeed');
    }

});

module.exports = feedSelectorStore;
