'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Unicycle = require('../../Unicycle');
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var uploadProfileImageStore = require('../../stores/profile/UploadProfileImageStore');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');

var {
  View,
  Text,
  StyleSheet,
  NativeModules,
  ActivityIndicatorIOS
} = React

var styles = StyleSheet.create({
  uploadProfileImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
    width: 150
  },
  uploadProfileImageText: {
    textAlign: 'center',
    padding: 5,
    paddingTop: 7, //for some reason padding: 5 doesn't perfectly center the text
    color: 'red',
    fontWeight: '500',
    borderWidth: 3,
    borderColor: 'maroon'
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
      <View style={styles.uploadProfileImageContainer}>
        { content }
      </View>
    );
  },

  _renderUploadPhotoPrompt: function() {
    return (
      <Text
        style={styles.uploadProfileImageText}
        onPress={this._onUploadImagePress}>
        tap here to upload profile picture
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
    UIImagePickerManager.showImagePicker(this._getImagePickerOptions(), (didCancel, response) => {
      if (!didCancel) {
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
      quality: .5, //TODO
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
