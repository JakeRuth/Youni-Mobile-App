'use strict';

var immutable = require('immutable');
var Unicycle = require('../Unicycle');

var showUploadProfileImagePromptStore = Unicycle.createStore({

  init: function() {
    this.set({
      showOnHomeFeed: false,
      showOnProfilePage: false
    });
  },

  setShowOnHomeFeed: function(value) {
    this.set({
      showOnHomeFeed: value
    });
  },

  setShowOnProfilePage: function(value) {
    this.set({
      showOnProfilePage: value
    });
  },
  
  getShowOnHomeFeed: function() {
    return this.get('showOnHomeFeed');
  },
  
  getShowOnProfilePage: function() {
    return this.get('showOnProfilePage');
  }

});

module.exports = showUploadProfileImagePromptStore;
