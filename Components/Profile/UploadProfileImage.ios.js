'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Unicycle = require('../../Unicycle');
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var uploadProfileImageStore = require('../../stores/profile/UploadProfileImageStore');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');

var {
  TouchableHighlight,
  Text,
  StyleSheet,
  NativeModules,
  ActivityIndicatorIOS
} = React

var styles = StyleSheet.create({
  uploadProfileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: .5,
    borderColor: 'maroon'
  },
  uploadProfileImageText: {
    marginTop: 25,
    backgroundColor: 'transparent',
    textAlign: 'center',
    padding: 5,
    color: 'maroon'
  }
});

var UploadProfileImage = React.createClass({

  mixins: [
    Unicycle.listenTo(uploadProfileImageStore)
  ],

  render: function() {
    var content;
    if (uploadProfileImageStore.isUploadProfileImageRequestInFlight()) {
      content = this._renderSpinner();
    }
    else {
      content = this._renderUploadPhotoPrompt();
    }

    return (
      <TouchableHighlight
        style={styles.uploadProfileImageContainer}
        underlayColor={'transparent'}
        onPress={this._onUploadImagePress}>
        {content}
      </TouchableHighlight>
    );
  },

  _renderUploadPhotoPrompt: function() {
    return (
      <Text style={styles.uploadProfileImageText}>
        Upload Profile Photo
      </Text>
    );
  },

  _renderSpinner: function() {
    return (
      <ActivityIndicatorIOS
        size="small"
        color="black"
        animating={true} />
    );
  },

  _onUploadImagePress: function() {
    UIImagePickerManager.showImagePicker(this._getImagePickerOptions(), (response) => {
      if (!response.didCancel) {
        Unicycle.exec('setIsUploadProfileImageRequestInFlight', true);

  			NativeModules.FileTransfer.upload(this._getImageUploadOptions(response), (err, res) => {
          var imageUrl = this._hackyWayToGetPictureUrlFromDumbStringThatShouldBeAMap(res.data);
          Unicycle.exec('setProfileImageUrl', imageUrl);
          Unicycle.exec('setIsUploadProfileImageRequestInFlight', true);
      	});
      }
    });
  },

  _getImagePickerOptions: function() {
    return {
      maxWidth: 640, //TODO
      maxHeight: 640, //TODO
      quality: 1, //TODO
      allowsEditing: true, //TODO
      noData: true,
      storageOptions: {
        skipBackup: true,
        path: 'Youni'
      }
    };
  },

  _getImageUploadOptions: function(response) {
    var url = AjaxUtils.SERVER_URL + '/upload/profilePhoto'
    return {
      uri: response.uri,
      uploadUrl: url,
      fileName: 'picture', //the name here has no meaning, it could really be anything
      mimeType: 'image/jpeg',
      data: {
        userIdString: userLoginMetadataStore.getUserId()
      }
    };
  },

  //TODO: Fix this ugly shit and make it nice
  _hackyWayToGetPictureUrlFromDumbStringThatShouldBeAMap: function(ugly) {
    var start = ugly.indexOf("pictureUrl") + 13;
    var end = ugly.indexOf("message") - 3;
    return ugly.substring(start, end);
  }

});

module.exports = UploadProfileImage;
