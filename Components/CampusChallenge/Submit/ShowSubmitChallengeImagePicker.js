'use strict';

var ReactNative = require('react-native');
var UIImagePickerManager = require('react-native-image-picker');

var AjaxUtils = require('../../../Utils/Common/AjaxUtils');

var {
  NativeModules,
  AlertIOS
} = ReactNative;

var ShowSubmitChallengeImagePicker = {

  showImagePicker: function(getImageCallback, uploadImageCallback) {
    UIImagePickerManager.showImagePicker(this._getImagePickerOptions(), (response) => {
      if (!response.didCancel) {
        let imageUri = response.uri.replace('file://', '');

        getImageCallback(imageUri);
        this._uploadImage(response, uploadImageCallback);
      }
    });
  },

  _uploadImage: function(response, uploadImageCallback) {
    NativeModules.FileTransfer.upload(this._getImageUploadOptions(response), (err, res) => {
      let resBodyJson = JSON.parse(res.data);

      if (err || res.status !== 200 || !resBodyJson.success) {
        this._onImageUploadError();
      }
      else {
        uploadImageCallback(resBodyJson.pictureId);
      }
    });
  },

  _onImageUploadError: function() {
    AlertIOS.alert(
      'Error uploading post photo',
      'If this problem persists, please contact support@youniapp.com',
      [
        {
          text: 'Ok'
        }
      ]
    );
  },

  _getImagePickerOptions: function() {
    return {
      title: 'Upload a Photo',
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

module.exports = ShowSubmitChallengeImagePicker;
