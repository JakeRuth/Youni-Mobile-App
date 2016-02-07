'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');

var uploadProfileImageStore = Unicycle.createStore({

    init: function () {
      this.set({
        isUploadProfileImageRequestInFlight: false
      });
    },

    setIsUploadProfileImageRequestInFlight: function(inFlight) {
      this.set({
        isUploadProfileImageRequestInFlight: inFlight
      });
    },

    isUploadProfileImageRequestInFlight: function() {
      return this.get('isUploadProfileImageRequestInFlight');
    }

});

module.exports = uploadProfileImageStore;
