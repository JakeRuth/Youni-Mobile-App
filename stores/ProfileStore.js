'use strict';

var React = require('react-native');
var Unicycle = require('./../Unicycle');
var request = require('superagent');
var prefix = require('superagent-prefix')('http://greedyapi.elasticbeanstalk.com');

var profileStore = Unicycle.createStore({

    //hard coded store, this will change when we integrate with the api
    init: function () {
      this.set({
        isRequestInFlight: false,
        firstName: '',
        lastName: '',
        numFollowers: null,
        bio: '',
        profileImageUrl: '',
        email: ''
      });
    },

    $loadUsersProfile(email) {
      var that = this;

      this.set({ isRequestInFlight: true });
      request
       .post('/user/getProfileInformation')
       .use(prefix)
       .send({ userEmail: email })
       .set('Accept', 'application/json')
       .end(function(err, res) {
         if ((res !== undefined) && (res.ok)) {
           that.set({
             isRequestInFlight: false,
             firstName: res.body.userDetails['firstName'],
             lastName: res.body.userDetails['lastName'],
             numFollowers: res.body.userDetails['numFollowers'],
             bio: res.body.userDetails['bio'],
             email: res.body.userDetails['email'],
             //TODO: This shouldn't be hardcoded
             profileImageUrl: 'https://scontent-lga3-1.xx.fbcdn.net/hphotos-frc3/v/t1.0-9/10472701_10152714655244039_5940899796472618864_n.jpg?oh=3ea5a4dc8337923a6c8338e042bb1a22&oe=56972CB2'
           });
         } else {
           //TODO: Implement a failed case
         }
       });
    },

    isRequestInFlight() {
      return this.get('isRequestInFlight');
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
    },

    getEmail: function() {
      return this.get('email');
    }

});

module.exports = profileStore;
