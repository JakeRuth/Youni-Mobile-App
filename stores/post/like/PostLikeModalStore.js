'use strict';

var React = require('react-native');
var Unicycle = require('./../../../Unicycle');
var AjaxUtils = require('../../../Utils/Common/AjaxUtils');

var postLikeModalStore = Unicycle.createStore({

  init: function() {
    this.set({
      isVisible: false,
      isRequestInFlight: false,
      likers: []
    });
  },

  $getLikersForPost(postId) {
    var that = this;

    this.set({
      isRequestInFlight: true
    });

    AjaxUtils.ajax(
      '/post/getLikerDisplayNames',
      {
        postIdString: postId
      },
      (res) => {
        that.set({
          likers: res.body.users,
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

  $setIsModalVisible: function(isVisible) {
    this.set({
      isVisible: isVisible
    });
  },

  getIsVisible: function() {
    return this.get('isVisible');
  },

  getLikerDisplayNames: function() {
    return this.get('likers');
  },

  isRequestInFlight: function() {
    return this.get('isRequestInFlight');
  }

});

module.exports = postLikeModalStore;
