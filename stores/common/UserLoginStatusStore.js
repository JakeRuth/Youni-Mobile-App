'use strict';

var Unicycle = require('../../Unicycle');

var userLoginStatusStore = Unicycle.createStore({

  init: function() {
    this.set({
      isLoggedIn: false
    });
  },

  setIsLoggedIn: function(value) {
    this.set({
      isLoggedIn: value
    });
  },

  isLoggedIn: function() {
    return this.get('isLoggedIn');
  }

});

module.exports = userLoginStatusStore;
