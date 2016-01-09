'use strict';

var React = require('react-native');
var Unicycle = require('./../../Unicycle');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var UserUtils = require('../../Utils/User/UserUtils');

var getAllFollowingStore = Unicycle.createStore({

    init: function() {
      this.set({
        allFollowing: [],
        isRequestInFlight: false,
        isInView: false
      });
    },

    $getFollowing(userEmail) {
      var allFollowing = [],
          that = this;

      this.set({
        isRequestInFlight: true,
        isInView: true
      });

      AjaxUtils.ajax(
        '/user/getAllFollowing',
        {
          userEmail: userEmail
        },
        (res) => {
          that.set({
            allFollowing: UserUtils.convertResponseUserListToMap(res.body.allFollowerDetails),
            isRequestInFlight: false
          });
        },
        () => {
          that.set({
            isRequestInFlight: false
          });
        }
      );
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
    }

});

module.exports = getAllFollowingStore;
