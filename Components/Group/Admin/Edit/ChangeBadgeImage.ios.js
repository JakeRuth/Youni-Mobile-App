'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;

var Spinner = require('../../../Common/Spinner');

var AjaxUtils = require('../../../../Utils/Common/AjaxUtils');
var Colors = require('../../../../Utils/Common/Colors');
var userLoginMetadataStore = require('../../../../stores/UserLoginMetadataStore');

var {
  View,
  Image,
  Text,
  StyleSheet,
  NativeModules,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  label: {
    position: 'absolute',
    top: 0,
    left: 0,
    color: Colors.DARK_GRAY,
    fontSize: 16,
    fontWeight: '100'
  },
  badgeImage: {
    marginTop: 10,
    width: 100,
    height: 100,
    borderRadius: 24
  },
  uploadBadeImageIcon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: -5,
    right: -5,
    height: 30,
    width: 30,
    borderRadius: 15
  }
});

var ChangeBadgeImage = React.createClass({

  propTypes: {
    groupIdString: React.PropTypes.string.isRequired,
    groupBadgeImageUrl: React.PropTypes.string.isRequired
  },

  getInitialState: function() {
    return {
      isUploading: false,
      newImageUrl: null
    };
  },

  render: function() {
    var badgeImage;

    if (this.state.isUploading) {
      badgeImage = (
        <Spinner style={styles.badgeImage}/>
      );
    }
    else {
      badgeImage = (
        <Image
          style={styles.badgeImage}
          source={{uri: this.state.newImageUrl ? this.state.newImageUrl : this.props.groupBadgeImageUrl}}/>
      );
    }

    return (
      <View style={styles.container}>

        <Text style={styles.label}>
          Badge
        </Text>

        <TouchableHighlight
          underlayColor="transparent"
          onPress={this.onUploadImagePress}>

          <View>
            {badgeImage}

            <TouchableHighlight
              style={[styles.uploadBadeImageIcon, { backgroundColor: Colors.getPrimaryAppColor() }]}
              underlayColor={Colors.getPrimaryAppColor()}
              onPress={this.onUploadImagePress}>
              <Icon
                name='android-camera'
                size={15}
                color='white'/>
            </TouchableHighlight>
          </View>

        </TouchableHighlight>

      </View>
    );
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
          var imageUrl = JSON.parse(res.data).imageUrl;

          that.setState({
            newImageUrl: imageUrl,
            isUploading: false
          });
        });
      }
    });
  },

  _getImagePickerOptions: function() {
    return {
      maxWidth: 200,
      maxHeight: 200,
      quality: .5,
      allowsEditing: true,
      noData: true
    };
  },

  _getImageUploadOptions: function(response) {
    var url = AjaxUtils.SERVER_URL + '/upload/groupBadgePhoto';
    return {
      uri: response.uri,
      uploadUrl: url,
      fileName: 'picture', //the name here has no meaning, it could really be anything
      mimeType: 'image/jpeg',
      data: {
        groupIdString: this.props.groupIdString,
        requestingUserIdString: userLoginMetadataStore.getUserId(),
        imageHeight: response.height,
        imageWidth: response.width
      }
    };
  }

});

module.exports = ChangeBadgeImage;
