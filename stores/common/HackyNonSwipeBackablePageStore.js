'use strict';

var Unicycle = require('../../Unicycle');

var NonSwipeBackablePage = require('../../Utils/Enums/NonSwipeBackablePage');

var hackyNonSwipeBackablePageStore = Unicycle.createStore({

  init: function() {
    this.set({
      currentVisiblePage: null
    });
  },

  setPage: function(value) {
    this.set({
      currentVisiblePage: value
    });
  },
  
  hidePage: function() {
    this.setPage(null);
  },

  getCurrentVisiblePage: function() {
    return this.get('currentVisiblePage');
  }

});

module.exports = hackyNonSwipeBackablePageStore;
