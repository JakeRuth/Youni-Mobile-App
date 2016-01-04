'use strict';

var React = require('react-native');
var Unicycle = require('../Unicycle');
var PostUtils = require('../Utils/Post/PostUtils');

var createPostStore = Unicycle.createStore({

    init: function () {
      this.set({
        isRequestInFlight: false,
        postUploadedSuccessfully: false,
        isImageUploading: false,
        wasImageSelected: false,
        imageUri: '',
        imageId: '',
        caption: '',
        pageLoadError: false,
        shouldShowImagePicker: true
      });
    },

    $createPost: function(userId, imageId, caption) {
      var that = this;

      this.set({
        isRequestInFlight: true,
        shouldShowImagePicker: false
      });

      PostUtils.ajax(
        '/post/create',
        {
          posterUserIdString: userId,
          pictureIdString: imageId,
          caption: caption ? caption : '_' //TODO: Fix this in the api!!!!
        },
        (res) => {
          that.set({
            isRequestInFlight: false,
            pageLoadError: false,
            postUploadedSuccessfully: true
          });
          that._cleanUp();
        },
        () => {
          that.set({
            isRequestInFlight: false,
            pageLoadError: true
          });
        }
      );
    },

    $setAnyErrorsOnCreatePostPage: function(value) {
      this.set({
        pageLoadError: value
      });
    },

    $setIsImageUploading: function(isUploading) {
      this.set({
        isImageUploading: isUploading
      });
    },

    $setWasImageSelected: function(selected) {
      this.set({
        wasImageSelected: selected
      });
    },

    $setImageUri: function(uri) {
      this.set({
        imageUri: uri
      });
    },

    $setImageId: function(id) {
      this.set({
        imageId: id
      });
    },

    $setCaption: function(caption) {
      this.set({
        caption: caption
      });
    },

    $setShouldShowImagePickerForPost: function(value) {
      this.set({
        shouldShowImagePicker: value
      });
    },

    anyErrorsLoadingPage: function() {
      return this.get('pageLoadError');
    },

    isRequestInFlight: function() {
      return this.get('isRequestInFlight');
    },

    getIsImageUploading: function() {
      return this.get('isImageUploading');
    },

    getPostUploadedSuccessfully: function() {
      return this.get('postUploadedSuccessfully');
    },

    getWasImageSelected: function() {
      return this.get('wasImageSelected');
    },

    getImageUri: function() {
      return this.get('imageUri');
    },

    getImageId: function() {
      return this.get('imageId');
    },

    getCaption: function() {
      return this.get('caption');
    },

    getShouldShowImagePicker: function() {
      return this.get('shouldShowImagePicker');
    },

    _cleanUp: function() {
      this.set({
        isRequestInFlight: false,
        isImageUploading: false,
        wasImageSelected: false,
        imageUri: '',
        imageId: '',
        caption: ''
      });
    }

});

module.exports = createPostStore;
