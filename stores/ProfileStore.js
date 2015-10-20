'use strict';

var React = require('react-native');
var Unicycle = require('./../Unicycle');

var profileStore = Unicycle.createStore({

    //hard coded store, this will change when we integrate with the api
    init: function () {
      this.set({
        firstName: 'Jake',
        lastName: 'Ruth',
        numFollowers: 15,
        bio: 'I really hope that we can get a working prototype together by Halloween!',
        profileImageUrl: 'https://scontent-lga3-1.xx.fbcdn.net/hphotos-frc3/v/t1.0-9/10472701_10152714655244039_5940899796472618864_n.jpg?oh=3ea5a4dc8337923a6c8338e042bb1a22&oe=56972CB2'
      });
    },

    getFirstName: function() {
      return this.get('firstName');
    },

    getLastName: function() {
      return this.get('lastName');
    },

    getNumFollowers: function() {
      return this.get('numFollowers');
    },

    getBio: function() {
      return this.get('bio');
    },

    getProfileImageUrl: function() {
      return this.get('profileImageUrl');
    }

});

module.exports = profileStore;
