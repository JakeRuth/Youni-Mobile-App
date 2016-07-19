'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;

var Spinner = require('../../../Common/Spinner');

var userLoginMetadataStore = require('../../../../stores/UserLoginMetadataStore');
var AjaxUtils = require('../../../../Utils/Common/AjaxUtils');

var {
  View,
  Image,
  NativeModules,
  StyleSheet,
  Dimensions,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  container: {
    height: 125,
    position: 'relative'
  },
  coverImage: {
    flex: 1,
    height: 125
  },
  uploadImageIconContainer: {
    position: 'absolute',
    top: 50,
    left: (Dimensions.get('window').width - 42) / 2,
    height: 42,
    width: 42,
    borderRadius: 21,
    paddingLeft: 5.5, // makes up for the fact the ion icons aren't naturally centered
    paddingTop: 2,
    backgroundColor: 'rgba(0, 0, 0, .25)'
  }
});

var ChangeProfilePicture = React.createClass({

  propTypes: {
    group: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired,
      description: React.PropTypes.string.isRequired,
      coverImageUrl: React.PropTypes.string.isRequired,
      badgeImageUrl: React.PropTypes.string.isRequired,
      adminEmails: React.PropTypes.array,
      allTimeTrendPoints: React.PropTypes.number.isRequired,
      numPosts: React.PropTypes.number.isRequired,
      numMembers: React.PropTypes.number.isRequired
    }).isRequired
  },

  getInitialState: function() {
    return {
      isUploading: false,
      newImageUrl: null
    };
  },

  render: function() {
    var icon;

    if (this.state.isUploading) {
      icon = (
        <Spinner
          color="white"
          style={{
            marginTop: 8,
            marginRight: 5
          }}/>
      );
    }
    else {
      icon = (
        <Icon
          name='android-camera'
          size={35}
          color='white'/>
      );
    }

    return (
      <View style={styles.container}>

        <Image
          style={styles.coverImage}
          resizeMode="cover"
          source={{uri: this.state.newImageUrl ? this.state.newImageUrl : this.props.group.coverImageUrl}}/>

        <TouchableHighlight
          style={styles.uploadImageIconContainer}
          underlayColor="transparent"
          onPress={this.onUploadImagePress}>
          <View>
            {icon}
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
            isUploading: false,
            newImageUrl: imageUrl
          });
        });
      }
    });
  },

  _getImagePickerOptions: function() {
    return {
      quality: .5,
      allowsEditing: true,
      noData: true
    };
  },

  _getImageUploadOptions: function(response) {
    var url = AjaxUtils.SERVER_URL + '/upload/groupCoverPhoto';
    return {
      uri: response.uri,
      uploadUrl: url,
      fileName: 'picture', //the name here has no meaning, it could really be anything
      mimeType: 'image/jpeg',
      data: {
        groupIdString: this.props.group.id,
        requestingUserIdString: userLoginMetadataStore.getUserId(),
        imageHeight: response.height,
        imageWidth: response.width
      }
    };
  }

});

module.exports = ChangeProfilePicture;
