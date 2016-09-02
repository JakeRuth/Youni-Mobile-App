'use strict';

var immutable = require('immutable');
var Unicycle = require('../Unicycle');

var mainAppSwipePageStore = Unicycle.createStore({

  init: function() {
    this.set({
      swipeFrameAmount: 0,
      shouldTriggerAutoScroll: false
    });
  },
  
  setSwipeFrameAmount: function(value) {
    this.set({
      swipeFrameAmount: value,
      shouldTriggerAutoScroll: true
    });
  },
  
  setShouldTriggerAutoScroll: function(value) {
    this.set({
      shouldTriggerAutoScroll: value
    });
  },
  
  shouldTriggerAutoScroll: function() {
    return this.get('shouldTriggerAutoScroll');
  },

  getSwipeFrameAmount: function() {
    return this.get('swipeFrameAmount');
  }

});

module.exports = mainAppSwipePageStore;
