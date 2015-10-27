'use strict';

var React = require('react-native');
var Unicycle = require('./../Unicycle');
var request = require('superagent');
var prefix = require('superagent-prefix')('http://localhost:8080/Greedy');

var followUnfollowStore = Unicycle.createStore({

    init: function () {
      this.set({
        isRequestInFlight: false,
        isUserFollowingResult: null
      });
    },

    $isUserFollowing(requestingUserId, userEmail) {
      var that = this;

      this.set({ isRequestInFlight: true });
      request
       .post('/user/isFollowing')
       .use(prefix)
       .send({
         requestingUserIdString: requestingUserId,
         userEmail: userEmail
       })
       .set('Accept', 'application/json')
       .end(function(err, res) {
         if ((res !== undefined) && (res.ok)) {
           that.set({
             isRequestInFlight: false,
             isUserFollowingResult: res.body.following
           });
         } else {
           //TODO: Implement a failed case
         }
       });
    },

    $follow(requestingUserId, userEmail) {
      var that = this;

      this.set({ isRequestInFlight: true });
      request
       .post('/user/follow')
       .use(prefix)
       .send({
         requestingUserIdString: requestingUserId,
         userToFollowEmail: userEmail
       })
       .set('Accept', 'application/json')
       .end(function(err, res) {
         console.log(res.body)
         if ((res !== undefined) && (res.ok)) {
           that.set({
             isRequestInFlight: false,
             isUserFollowingResult: true //TODO: this could be a lie if the call fails
           });
         } else {
           //TODO: Implement a failed case
         }
       });
    },

    $unfollow(requestingUserId, userEmail) {
      var that = this;

      this.set({ isRequestInFlight: true });
      request
       .post('/user/removeFollow')
       .use(prefix)
       .send({
         requestingUserIdString: requestingUserId,
         userToNotFollowEmail: userEmail
       })
       .set('Accept', 'application/json')
       .end(function(err, res) {
         if ((res !== undefined) && (res.ok)) {
           that.set({
             isRequestInFlight: false,
             isUserFollowingResult: false
           });
         } else {
           //TODO: Implement a failed case
         }
       });
    },

    isRequestInFlight: function() {
      return this.get('isRequestInFlight');
    },

    getIsUserFollowingResult: function() {
      return this.get('isUserFollowingResult');
    }

});

module.exports = followUnfollowStore;
