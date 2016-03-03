'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');

var signUpStore = Unicycle.createStore({

    init: function () {
      this.set({
        inSignUpView: false
      });
    },

    $setInSignUpView: function(isInFlight) {
      this.set({
        inSignUpView: isInFlight
      });
    },

    isInSignUpView: function() {
      return this.get('inSignUpView');
    }

});

module.exports = signUpStore;
