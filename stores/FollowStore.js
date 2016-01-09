'use strict';

var React = require('react-native');
var Unicycle = require('../Unicycle');
var AjaxUtils = require('../Utils/Common/AjaxUtils');

var followUnfollowStore = Unicycle.createStore({

    init: function () {
      this.set({
        isRequestInFlight: false,
        isUserFollowingResult: null
      });
    },

    $isUserFollowing(requestingUserId, userEmail) {
      var that = this;

      this.set({
        isRequestInFlight: true
      });

      AjaxUtils.ajax(
        '/user/isFollowing',
        {
          requestingUserIdString: requestingUserId,
          userEmail: userEmail
        },
        (res) => {
          that.set({
            isRequestInFlight: false,
            isUserFollowingResult: res.body.following
          });
        },
        () => {
          that.set({
            isRequestInFlight: false
          });
        }
      );
    },

    $follow(requestingUserId, userEmail) {
      var that = this;

      this.set({
        isRequestInFlight: true
      });

      AjaxUtils.ajax(
        '/user/follow',
        {
          requestingUserIdString: requestingUserId,
          userToFollowEmail: userEmail
        },
        (res) => {
          that.set({
            isRequestInFlight: false,
            isUserFollowingResult: true //TODO: this could be a lie if the call fails
          });
        },
        () => {
          that.set({
            isRequestInFlight: false
          });
        }
      );
    },

    $unfollow(requestingUserId, userEmail) {
      var that = this;

      this.set({
        isRequestInFlight: true
      });

      AjaxUtils.ajax(
        '/user/removeFollow',
        {
          requestingUserIdString: requestingUserId,
          userToNotFollowEmail: userEmail
        },
        (res) => {
          that.set({
            isRequestInFlight: false,
            isUserFollowingResult: false
          });
        },
        () => {
          that.set({
            isRequestInFlight: false
          });
        }
      );
    },

    isRequestInFlight: function() {
      return this.get('isRequestInFlight');
    },

    getIsUserFollowingResult: function() {
      return this.get('isUserFollowingResult');
    }

});

module.exports = followUnfollowStore;
