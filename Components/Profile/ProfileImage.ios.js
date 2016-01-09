'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Unicycle = require('../../Unicycle');
var UploadProfileImage = require('./UploadProfileImage');
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var uploadProfileImageStore = require('../../stores/profile/UploadProfileImageStore');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');

var {
  View,
  Image,
  StyleSheet,
  NativeModules,
  TouchableHighlight
} = React

var styles = StyleSheet.create({
  profileImageContainer: {
    flex: 1,
    marginTop: -100,
    marginLeft: 20
  },
  profileImage: {
    width: 168,
    height: 168,
    alignSelf: 'center',
    marginTop: 4
  }
});

var ProfileImage = React.createClass({

  propTypes: {
    viewerIsProfileOwner: React.PropTypes.bool.isRequired,
    profileImageUrl: React.PropTypes.string
  },

  render: function() {
    var content;

    if (this.props.profileImageUrl) {
      content = this.renderProfileImage();
    }
    else if (this.props.viewerIsProfileOwner) {
      content = <UploadProfileImage />;
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
      <TouchableHighlight onPress={this._onUploadImagePress}>
        <Image style={styles.profileImage}
               source={{uri: this.props.profileImageUrl}} />
      </TouchableHighlight>
    );
  },

  renderBlankProfileIcon: function() {
    return (
      <Icon
        name='ios-person'
        size={150}
        color='#007C9E' />
    );
  },

  //TODO: ALL these function are repeated, stop the ugly!!!!!
  _onUploadImagePress: function() {
    if (this.props.viewerIsProfileOwner) {
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
    }
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

module.exports = ProfileImage;
