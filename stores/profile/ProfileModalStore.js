'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');

var profileModalStore = Unicycle.createStore({

  init: function() {
    this.set({
      isVisible: false
    });
  },

  $setProfileModalVisibile: function(isVisible) {
    this.set({
      isVisible: isVisible
    });
  },

  getIsVisible: function() {
    return this.get('isVisible');
  }

});

module.exports = profileModalStore;
