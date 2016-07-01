'use strict';

var React = require('react-native');
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;

var CreatePostForm = require('./CreatePostForm');
var createPostStore = require('../../stores/CreatePostStore');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');

var {
  NativeModules,
  AlertIOS
} = React;

var ShowImagePicker = {

  showImagePicker: function(navigator) {
    UIImagePickerManager.showImagePicker(this._getImagePickerOptions(), (response) => {
      if (!response.didCancel) {
        let imageUri = response.uri.replace('file://', '');
        this._onImageSelect(navigator, imageUri, response.height / 2);
        
        // let some time elapse for the navigator page push to take place
        setTimeout(function() {
          this._uploadImage(response, navigator);
        }.bind(this), 100);
      }
    });
  },
  
  _uploadImage: function(response, navigator) {
    NativeModules.FileTransfer.upload(this._getImageUploadOptions(response), (err, res) => {
      let resBodyJson = JSON.parse(res.data);
      
      if (err || res.status !== 200 || !resBodyJson.success) {
        this._onImageUploadError(navigator);
      }
      else {
        createPostStore.setImageId(resBodyJson.pictureId);
      }
    });
  },
  
  _onImageSelect: function(navigator, imageUri, imageHeight) {
    navigator.push({
      component: CreatePostForm,
      passProps: {
        imageUri: imageUri,
        imageHeight: imageHeight
      }
    });
  },

  _onImageUploadError: function(navigator) {
    AlertIOS.alert(
      'Error uploading post photo',
      'If this problem persists, please contact support@youniapp.com',
      [
        {
          text: 'Ok',
          onPress: () => { navigator.pop(); }
        }
      ]
    );
  },

  _getImagePickerOptions: function() {
    return {
      title: 'Upload a photo',
      quality: .5,
      allowsEditing: true,
      noData: false
    };
  },

  _getImageUploadOptions: function(response) {
    var url = AjaxUtils.SERVER_URL + '/upload/photo';
    return {
      uri: response.uri,
      uploadUrl: url,
      fileName: 'picture', //the name here has no meaning, it could really be anything
      mimeType: 'image/jpeg',
      data: {
        imageHeight: response.height,
        imageWidth: response.width
      }
    };
  }

};

module.exports = ShowImagePicker;
