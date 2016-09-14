'use strict';

var React = require('react');
var ReactNative = require('react-native');
var UIImagePickerManager = require('react-native-image-picker');
var Icon = require('react-native-vector-icons/MaterialIcons');

var Spinner = require('../Common/Spinner');

var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Text,
  Image,
  AlertIOS,
  NativeModules,
  StyleSheet,
  Dimensions,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  uploadProfileImageContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  appIcon: {
    height: 200,
    width: 200,
    borderRadius: 24
  },
  uploadImageIconContainer: {
    position: 'absolute',
    bottom: -15,
    right: -15,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    width: 60,
    borderRadius: 30
  },
  uploadProfileImageMessage: {
    flex: 1,
    color: Colors.DARK_GRAY,
    fontSize: 20,
    width: 250,
    textAlign: 'center',
    marginTop: -25
  },
  nextButton: {
    height: 50,
    width: Dimensions.get('window').width,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonLabel: {
    color: 'white',
    fontSize: 20
  }
});

var InitialPromptUploadPicture = React.createClass({

  propTypes: {
    onNextPress: React.PropTypes.func.isRequired
  },
  
  getInitialState: function() {
    return {
      isUploading: false,
      newProfileImageUrl: null
    };
  },

  render: function() {
    var uploadProfilePromptMessage;

    if (!this.state.newProfileImageUrl) {
      uploadProfilePromptMessage = 'Please take a moment to upload your profile picture';
    }
    else {
      uploadProfilePromptMessage = "Wow you're lookin' good!";
    }

    return (
      <View style={[styles.container, this.props.style]}>
        
        <View style={styles.uploadProfileImageContainer}>
          <View>
            {this._renderProfileImage()}
            <TouchableHighlight
              style={[styles.uploadImageIconContainer, { backgroundColor: Colors.getPrimaryAppColor() }]}
              underlayColor={Colors.getPrimaryAppColor()}
              onPress={this.onUploadImagePress}>
              <View>
                {this._renderUploadIcon()}
              </View>
            </TouchableHighlight>
          </View>
        </View>

        <Text style={styles.uploadProfileImageMessage}>
          {uploadProfilePromptMessage}
        </Text>

        <TouchableHighlight
          style={[styles.nextButton, { backgroundColor: Colors.getPrimaryAppColor() }]}
          underlayColor={Colors.getPrimaryAppColor()}
          onPress={this._onNextPress}>
          <Text style={styles.buttonLabel}>
            Next
          </Text>
        </TouchableHighlight>
        
      </View>
    );
  },

  _renderProfileImage: function() {
    var content;

    if (this.state.newProfileImageUrl) {
      content = (
        <Image
          style={styles.appIcon}
          resizeMode="contain"
          source={{uri: this.state.newProfileImageUrl}}/>
      );
    }
    else {
      content = (
        <Image
          style={styles.appIcon}
          source={require('../../images/YouniAppIcon.png')}/>
      );
    }

    return (
      <TouchableHighlight
        underlayColor="transparent"
        onPress={this.onUploadImagePress}>
        {content}
      </TouchableHighlight>
    )
  },

  _renderUploadIcon: function() {
    if (this.state.isUploading) {
      return <Spinner color="white"/>;
    }
    else {
      return (
        <Icon
          name='photo-camera'
          size={30}
          color='white'/>
      );
    }
  },

  _onNextPress: function() {
    if (!this.state.newProfileImageUrl) {
      AlertIOS.alert(
        'Please upload a profile picture before entering Youni',
        ''
      )
    }
    else {
      this.props.onNextPress();
    }
  },

  //TODO: ALL these function are repeated, stop the ugly!!!!!
  onUploadImagePress: function() {
    var that = this;

    UIImagePickerManager.showImagePicker(this._getImagePickerOptions(), (response) => {
      if (!response.didCancel) {
        that.setState({
          isUploading: true
        });

        NativeModules.FileTransfer.upload(this._getImageUploadOptions(response), (err, res) => {
          var imageUrl = JSON.parse(res.data).pictureUrl;

          that.setState({
            isUploading: false,
            newProfileImageUrl: imageUrl
          });
          userLoginMetadataStore.setProfileImageUrl(imageUrl);
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

module.exports = InitialPromptUploadPicture;
