'use strict';

var React = require('react-native');
var Unicycle = require('../Unicycle');
var RefreshAppContentUtil = require('../Utils/Common/RefreshAppContentUtil');

var tabStateStore = Unicycle.createStore({

  init: function () {
    this.set({
      previousTab: '',
      selectedTab: ''
    });
  },

  setSelectedTab: function (newTabValue) {
    var currTabValue = tabStateStore.getSelectedTab();
    this._setPreviousTab(currTabValue);
    this.set({
      selectedTab: newTabValue
    });
  },
  
  _setPreviousTab: function(value) {
    this.set({
      previousTab: value
    })
  },

  getPreviousTab: function () {
    return this.get('previousTab');
  },

  getSelectedTab: function () {
    return this.get('selectedTab');
  }

});

module.exports = tabStateStore;
