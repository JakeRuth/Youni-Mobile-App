'use strict';

var React = require('react-native');
var createPostStore = require('./stores/CreatePostStore');
var userLoginMetadataStore = require('./stores/UserLoginMetadataStore');
var homePostsStore = require('./stores/post/HomePostsStore');
var Unicycle = require('./Unicycle');
var MainScreenBanner = require('./MainScreenBanner');
var CreatePostForm = require('./Components/Post/CreatePostForm');
var ErrorPage = require('./Components/Common/ErrorPage');
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;
var AjaxUtils = require('./Utils/Common/AjaxUtils');
var Spinner = require('./Components/Common/Spinner');

var {
  View,
  Text,
  StyleSheet,
  NativeModules
} = React;

var styles = StyleSheet.create({
  createPostPageContainer: {
    flex: 1
  }
});

var CreatePostPage = React.createClass({

  mixins: [
    Unicycle.listenTo(createPostStore)
  ],

  propTypes: {
    previousTab: React.PropTypes.string.isRequired
  },

  render: function() {
    var isImageUploading = createPostStore.getIsImageUploading(),
        wasImageSelected = createPostStore.getWasImageSelected(),
        isPostRequestInFlight = createPostStore.isRequestInFlight(),
        anyErrorsLoadingPage = createPostStore.anyErrorsLoadingPage(),
        shouldShowImagePicker = createPostStore.getShouldShowImagePicker(),
        content = <View/>;

    if (isPostRequestInFlight) {
      content = (
        <Spinner/>
      );
    }
    else if (anyErrorsLoadingPage) {
      content = (
        <ErrorPage
          reloadButtonAction={() => {}}
          hideReloadButton={true}
          subTitleMessageOverride='Something went wrong while creating your post'/>
      );
    }
    else if (wasImageSelected) {
      var uri = createPostStore.getImageUri();
      content = <CreatePostForm imageUri={uri} />
    }
    else if (shouldShowImagePicker) {
      this.showImagePicker();
      Unicycle.exec('setShouldShowImagePickerForPost', false);
    }

    return (
      <View style={styles.createPostPageContainer}>
        <MainScreenBanner title='Create Post'/>
        { content }
      </View>
    )
  },

  showImagePicker: function() {
    Unicycle.exec('setIsImageUploading', true);

    UIImagePickerManager.showImagePicker(this._getImagePickerOptions(), (response) => {
      if (!response.didCancel) {
        var uri = response.uri.replace('file://', '');
        Unicycle.exec('setWasImageSelected', true);
        Unicycle.exec('setImageUri', uri);

  			NativeModules.FileTransfer.upload(this._getImageUploadOptions(response), (err, res) => {
          if (err || res.status !== 200) {
            createPostStore.setImageUploadError(true);
          }
          else {
            let imageId = this._hackyWayToGetPictureIdFromDumbStringThatShouldBeAMap(res.data);
            Unicycle.exec('setImageId', imageId);
          }
          Unicycle.exec('setIsImageUploading', false);
        });
      }
      else {
        Unicycle.exec('setShouldShowImagePickerForPost', false);
        Unicycle.exec('setIsImageUploading', false);
        Unicycle.exec('setSelectedTab', this.props.previousTab);
      }
    });
  },

  _getImagePickerOptions: function() {
    return {
      title: 'Upload a photo to share',
      quality: .5, //TODO
      allowsEditing: true, //TODO
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
  },

  //TODO: Fix this ugly shit and make it nice
  _hackyWayToGetPictureIdFromDumbStringThatShouldBeAMap: function(ugly) {
    var start = ugly.indexOf("pictureId") + 12;
    var end = ugly.indexOf("message") - 3;
    return ugly.substring(start, end);
  }

});

module.exports = CreatePostPage;
