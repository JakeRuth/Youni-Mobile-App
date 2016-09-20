'use strict';

var Unicycle = require('../../Unicycle');

var mainAppSwipePageStore = Unicycle.createStore({

  init: function() {
    this.set({
      currentPageIndex: 1,
      swipeFrameAmount: 0,
      shouldTriggerAutoScroll: false
    });
  },

  navigatorTo: function(pageIndex) {
    var currentIndex = this.getCurrentPageIndex();
    if (currentIndex === pageIndex) {
      return;
    }

    var swipeAmount = currentIndex - pageIndex;
    swipeAmount *= -1;
    this.setSwipeFrameAmount(swipeAmount);
  },
  
  setCurrentPageIndex: function(value) {
    this.set({
      currentPageIndex: value
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

  getCurrentPageIndex: function() {
    return this.get('currentPageIndex')
  },

  getSwipeFrameAmount: function() {
    return this.get('swipeFrameAmount');
  }

});

module.exports = mainAppSwipePageStore;
