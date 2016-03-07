'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Unicycle = require('../../Unicycle');
var UploadProfileImage = require('./UploadProfileImage');
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var uploadProfileImageStore = require('../../stores/profile/UploadProfileImageStore');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var Spinner = require('../Common/Spinner');

var {
  View,
  Image,
  StyleSheet,
  NativeModules,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  profileImageContainer: {
    width: 100,
    height: 100,
    marginLeft: 10
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50
  }
});

var ProfileImage = React.createClass({

  propTypes: {
    viewerIsProfileOwner: React.PropTypes.bool.isRequired,
    profileImageUrl: React.PropTypes.string
  },

  mixins: [
      Unicycle.listenTo(uploadProfileImageStore)
  ],

  render: function() {
    var content;

    if (uploadProfileImageStore.isUploadProfileImageRequestInFlight()) {
      content = (
          <Spinner/>
      );
    }
    else if (this.props.profileImageUrl) {
      content = this.renderProfileImage();
    }
    else if (this.props.viewerIsProfileOwner) {
      content = (
          <UploadProfileImage onUploadPhotoPress={this._onUploadImagePress}/>
      );
    }
    else {
      content = this.renderBlankProfileIcon();
    }

    return (
      <View style={styles.profileImageContainer}>
        {content}
      </View>
    );
  },

  renderProfileImage: function() {
    return (
      <TouchableHighlight
        underlayColor='transparent'
        onPress={this._onUploadImagePress}>

        <Image
            style={styles.profileImage}
            source={{uri: this.props.profileImageUrl}}/>

      </TouchableHighlight>
    );
  },

  renderBlankProfileIcon: function() {
    return (
      <Icon
        name='ios-person'
        size={150}
        color='#5d6aff' />
    );
  },

  //TODO: ALL these function are repeated, stop the ugly!!!!!
  _onUploadImagePress: function() {
    if (this.props.viewerIsProfileOwner) {
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
    }
  },

  _getImagePickerOptions: function() {
    return {
      maxWidth: 640, //TODO
      maxHeight: 640, //TODO
      quality: .5, //TODO
      allowsEditing: true, //TODO
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

module.exports = ProfileImage;
