'use strict';

var React = require('react-native');
var Unicycle = require('./../Unicycle');
var request = require('superagent');
var prefix = require('superagent-prefix')('http://localhost:8080/Greedy');

var createPostStore = Unicycle.createStore({

    init: function () {
      this.set({
        isRequestInFlight: false,
        postUploadedSuccessfully: false,
        isImageUploading: false,
        wasImageSelected: false,
        imageUri: '',
        imageId: '',
        caption: ''
      });
    },

    $createPost: function(userId, imageId, caption) {
      var that = this;
      this.set({
        isRequestInFlight: true
      });

      request
       .post('/post/create')
       .use(prefix)
       .send({
         posterUserIdString: userId,
         pictureIdString: imageId,
         caption: caption
       })
       .set('Accept', 'application/json')
       .end(function(err, res) {
         if ((res !== undefined) && (res.ok)) {
           console.log('success: ', res)
           that.set({
             isRequestInFlight: false,
             postUploadedSuccessfully: true
           });
           that._cleanUp();
         } else {
           console.log('failed! ', res)
           //TODO: Implement a failed case
           that.set({
             isRequestInFlight: false
           });
         }
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
