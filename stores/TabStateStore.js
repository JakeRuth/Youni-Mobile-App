'use strict';

var React = require('react-native');
var Unicycle = require('../Unicycle');

var tabStateStore = Unicycle.createStore({

    init: function () {
      this.set({
        previousTab: '',
        selectedTab: ''
      });
    },

    $setPreviousTab: function(value) {
      this.set({
        previousTab: value
      });
    },

    $setSelectedTab: function(value) {
      this.set({
        selectedTab: value
      });
    },

    getPreviousTab: function() {
      return this.get('previousTab');
    },

    getSelectedTab: function() {
      return this.get('selectedTab');
    }

});

module.exports = tabStateStore;
