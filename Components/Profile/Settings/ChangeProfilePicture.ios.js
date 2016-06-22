'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Unicycle = require('../../../Unicycle');
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;

var ProfileImage = require('../ProfileImage');
var profileOwnerStore = require('../../../stores/profile/ProfileOwnerStore');
var userLoginMetadataStore = require('../../../stores/UserLoginMetadataStore');
var uploadProfileImageStore = require('../../../stores/profile/UploadProfileImageStore');
var AjaxUtils = require('../../../Utils/Common/AjaxUtils');
var Colors = require('../../../Utils/Common/Colors');

var {
  View,
  NativeModules,
  StyleSheet,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  uploadImageIconContainer: {
    position: 'absolute',
    bottom: -7,
    right: -7,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: Colors.YOUNI_PRIMARY_PURPLE
  }
});

var ChangeProfilePicture = React.createClass({

  mixins: [
    Unicycle.listenTo(profileOwnerStore),
    Unicycle.listenTo(uploadProfileImageStore)
  ],

  render: function() {
    return (
      <View>
        <ProfileImage
          profileImageUrl={profileOwnerStore.getProfileImageUrl()}
          isUploading={uploadProfileImageStore.isUploadProfileImageRequestInFlight()}
          onPress={this.onUploadImagePress}/>
        <TouchableHighlight
          style={styles.uploadImageIconContainer}
          underlayColor={Colors.YOUNI_PRIMARY_PURPLE}
          onPress={this.onUploadImagePress}>
          <Icon
            name='android-camera'
            size={15}
            color='white'/>
        </TouchableHighlight>
      </View>
    );
  },

  //TODO: ALL these function are repeated, stop the ugly!!!!!
  onUploadImagePress: function() {
    UIImagePickerManager.showImagePicker(this._getImagePickerOptions(), (response) => {
      if (!response.didCancel) {
        uploadProfileImageStore.setIsUploadProfileImageRequestInFlight(true);

        NativeModules.FileTransfer.upload(this._getImageUploadOptions(response), (err, res) => {
          var imageUrl = this._hackyWayToGetPictureUrlFromDumbStringThatShouldBeAMap(res.data);
          Unicycle.exec('setProfileImageUrl', imageUrl);
          uploadProfileImageStore.setIsUploadProfileImageRequestInFlight(false);
        });
      }
    });
  },

  _getImagePickerOptions: function() {
    return {
      maxWidth: 640,
      maxHeight: 640,
      quality: .5,
      allowsEditing: true,
      noData: true
    };
  },

  _getImageUploadOptions: function(response) {
    var url = AjaxUtils.SERVER_URL + '/upload/profilePhoto';
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

module.exports = ChangeProfilePicture;
