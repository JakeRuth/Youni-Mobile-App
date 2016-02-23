'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');

//TODO: Work should be done to remove the tech debt so this isn't needed
var profileStore = Unicycle.createStore({

    isLikeRequestInFlight: function() {
      return false;
    },

    isFeedRefreshing: function() {
      //always return false because the user's profile page feed is not refreshable
      return false;
    }

});

module.exports = profileStore;
