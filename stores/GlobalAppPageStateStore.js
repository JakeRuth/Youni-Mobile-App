'use strict';

var React = require('react-native');
var Unicycle = require('../Unicycle');
var PAGE_KEYS = require('../Utils/Enums/PageNameEnum');

var globalAppPageStateStore = Unicycle.createStore({

    init: function () {
      this.set({
        currentPage: PAGE_KEYS.loginPage
      });
    },

    setCurrentPage: function(pageKey) {
      this.set({
        currentPage: pageKey
      });
    },

    getCurrentPage: function() {
      return this.get('currentPage');
    }

});

module.exports = globalAppPageStateStore;
