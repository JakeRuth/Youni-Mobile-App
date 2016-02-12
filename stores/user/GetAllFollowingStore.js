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
        isVisible: false
      });
    },

    getFollowing(userEmail) {
      var that = this;

      this.set({
        isRequestInFlight: true,
        isVisible: true
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

    setVisibility(isVisible) {
      this.set({
        isVisible: isVisible
      });
    },

    isRequestInFlight() {
      return this.get('isRequestInFlight');
    },

    getAllFollowing() {
      return this.get('allFollowing');
    },

    isVisible: function() {
      return this.get('isVisible');
    }

});

module.exports = getAllFollowingStore;
