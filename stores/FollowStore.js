'use strict';

var React = require('react-native');
var Unicycle = require('../Unicycle');
var AjaxUtils = require('../Utils/Common/AjaxUtils');
var profileStore = require('../stores/profile/ProfileStore');

//TODO: Some of these actions should probably be on the profile stores.
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
          if (res.body.success) {
            profileStore.incrementFollowersCount();
          }

          that.set({
            isRequestInFlight: false,
            isUserFollowingResult: res.body.success
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
          profileStore.decrementFollowersCount();
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
