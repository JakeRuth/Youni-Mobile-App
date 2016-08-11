'use strict';

var React = require('react');
var ReactNative = require('react-native');
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
} = ReactNative;

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
    borderRadius: 15
  }
});

var ChangeProfilePicture = React.createClass({

  propTypes: {
    user: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      profileImageUrl: this.props.user.profileImageUrl
    };
  },

  mixins: [
    Unicycle.listenTo(profileOwnerStore),
    Unicycle.listenTo(uploadProfileImageStore)
  ],

  render: function() {
    return (
      <View>
        <ProfileImage
          {...this.props}
          imageOverrideUrl={this.state.profileImageUrl}
          isUploading={uploadProfileImageStore.isUploadProfileImageRequestInFlight()}
          onPress={this.onUploadImagePress}/>
        <TouchableHighlight
          style={[styles.uploadImageIconContainer, { backgroundColor: Colors.getPrimaryAppColor() }]}
          underlayColor={Colors.getPrimaryAppColor()}
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
    var that = this;
    
    UIImagePickerManager.showImagePicker(this._getImagePickerOptions(), (response) => {
      if (!response.didCancel) {
        uploadProfileImageStore.setIsUploadProfileImageRequestInFlight(true);

        NativeModules.FileTransfer.upload(this._getImageUploadOptions(response), (err, res) => {
          var imageUrl = JSON.parse(res.data).pictureUrl;
          
          Unicycle.exec('setProfileImageUrl', imageUrl);
          that.setState({ profileImageUrl: imageUrl });
          userLoginMetadataStore.setProfileImageUrl(imageUrl);
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
  }

});

module.exports = ChangeProfilePicture;
