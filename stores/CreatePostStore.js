'use strict';

var React = require('react-native');
var Unicycle = require('../Unicycle');
var AjaxUtils = require('../Utils/Common/AjaxUtils');

var createPostStore = Unicycle.createStore({

    init: function () {
      this.set({
        isRequestInFlight: false,
        imageId: '',
        caption: ''
      });
    },

    $createPost: function(userId, onSuccessCallback) {
      var that = this,
          caption = this.getCaption(),
          imageId = this.getImageId();

      this.set({
        isRequestInFlight: true
      });

      AjaxUtils.ajax(
        '/post/create',
        {
          posterUserIdString: userId,
          pictureIdString: imageId,
          caption: caption ? caption : '_' //TODO: Fix this in the api!!!!
        },
        (res) => {
          that.set({
            isRequestInFlight: false
          });

          onSuccessCallback();
        },
        () => {
          that.set({
            isRequestInFlight: false
          });
        }
      );
    },

    setImageId: function(id) {
      this.set({
        imageId: id
      });
    },

    setCaption: function(caption) {
      this.set({
        caption: caption
      });
    },

    isRequestInFlight: function() {
      return this.get('isRequestInFlight');
    },

    getImageId: function() {
      return this.get('imageId');
    },

    getCaption: function() {
      return this.get('caption');
    }

});

module.exports = createPostStore;
