'use strict';

var React = require('react-native');
var Unicycle = require('./../Unicycle');

var trendingStore = Unicycle.createStore({

  init: function() {
    this.set({
      trendingProfiles: []
    });
  },

  /**
   *
   * To be implemented when the trending logic is implemented in the ui
   *
   */

});

module.exports = trendingStore;
