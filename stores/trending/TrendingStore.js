'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var immutable = require('immutable');
var request = require('superagent');
var prefix = require('superagent-prefix')('http://greedyapi.elasticbeanstalk.com');

var trendingStore = Unicycle.createStore({

    init: function () {
      this.set({
        isTrendingRequestInFlight: true,
        inProfileView: false,
        users: [],
        userInView: null
      });
    },

    $getTrendingUsers: function() {
      var that = this;

      request
       .post('/trending/getTopUsers')
       .use(prefix)
       .set('Accept', 'application/json')
       .end(function(err, res) {
         if ((res !== undefined) && (res.ok)) {
           that.set({
             users: immutable.List(
               that._generateTrendingUserInfoFromResponse(res.body.users)
             )
           });
         } else {
           //TODO: Implement a failed case
         }
         that.set({
           isTrendingRequestInFlight: false
         });
       });
    },

    setInProfileView: function(value) {
      console.log('here ', value)
      this.set({
        inProfileView: value
      });
    },

    isRequestInFlight: function() {
      return this.get('isTrendingRequestInFlight');
    },

    getTrendingUsers: function() {
      return this.get('users');
    },

    getInProfileView: function() {
      this.get('inProfileView');
    },

    _generateTrendingUserInfoFromResponse: function(trendingUsers) {
      var trendingUsersJson = [];

      for (var i = 0; i < trendingUsers.length; i++) {
        var user = trendingUsers[i];
        trendingUsersJson.push({
          firstName: user['firstName'],
          lastName: user['lastName'],
          numFans: user['numFollowers'],
          bio: user['bio'],
          email: user['email'],
          profileImageUrl: user['profileImageUrl'],
          id: i
        });
      }
      return trendingUsersJson;
    }

});

module.exports = trendingStore;
