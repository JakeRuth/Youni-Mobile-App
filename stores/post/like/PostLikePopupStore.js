'use strict';

var React = require('react-native');
var Unicycle = require('./../../../Unicycle');
var AjaxUtils = require('../../../Utils/Common/AjaxUtils');
var UserUtils = require('../../../Utils/User/UserUtils');

var postLikePopupStore = Unicycle.createStore({

  init: function() {
    this.set({
      isVisible: false,
      isRequestInFlight: false,
      likers: []
    });
  },

  setVisibility: function(value) {
    this.set({
      isVisible: value
    });
  },

  getLikersForPost(postId) {
    var that = this;

    this.set({
      isRequestInFlight: true,
      isVisible: true
    });

    AjaxUtils.ajax(
      '/post/getLikerDisplayNames',
      {
        postIdString: postId
      },
      (res) => {
        that.set({
          likers: UserUtils.convertResponseUserListToMap(res.body.userDetails),
          isRequestInFlight: false
        });
      },
      () => {
        that.set({
          isRequestInFlight: false,
          isVisible: false
        });
      }
    );
  },

  isVisible: function() {
    return this.get('isVisible');
  },

  getLikerDisplayNames: function() {
    return this.get('likers');
  },

  isRequestInFlight: function() {
    return this.get('isRequestInFlight');
  }

});

module.exports = postLikePopupStore;
