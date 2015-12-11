'use strict';

var React = require('react-native');
var Unicycle = require('./../../Unicycle');
var request = require('superagent');
var prefix = require('superagent-prefix')('http://greedyapi.elasticbeanstalk.com');

var getAllFollowingStore = Unicycle.createStore({

    init: function() {
      this.set({
        allFollowing: [],
        isRequestInFlight: false,
        isInView: false
      });
    },

    $getFollowing(userEmail) {
      var allFollowing = [];
      var that = this;

      this.set({
        isRequestInFlight: true,
        isInView: true
      });

      request
       .post('/user/getAllFollowing')
       .use(prefix)
       .send({
         userEmail: userEmail
       })
       .set('Accept', 'application/json')
       .end(function(err, res) {
         if ((res !== undefined) && (res.ok)) {
           allFollowing = that._createUserJsonFromResponse(res.body.allFollowerDetails);
           that.set({
             allFollowing: allFollowing,
           });
         }
         else {
           //TODO: implement failed case (show user error message or cached results)
         }
         that.set({
           isRequestInFlight: false
         });
      });
    },

    setIsInView(isInView) {
      this.set({
        isInView: isInView
      });
    },

    isRequestInFlight() {
      return this.get('isRequestInFlight');
    },

    getAllFollowing() {
      return this.get('allFollowing');
    },

    getIsInView: function() {
      return this.get('isInView');
    },

    _createUserJsonFromResponse: function(allFollowing) {
      var allFollowingJson = [];
      for (var i = 0; i < allFollowing.length; i++) {
        var following = allFollowing[i];
        allFollowingJson.push({
          firstName: following['firstName'],
          lastName: following['lastName'],
          bio: following['bio'],
          numFollowers: following['numFollowers'],
          profileImageUrl: following['profileImageUrl'],
          email: following['email'],
          id: i
        });
      }
      return allFollowingJson;
    }

});

module.exports = getAllFollowingStore;
