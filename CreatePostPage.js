'use strict';

var React = require('react-native');
var createPostStore = require('./stores/CreatePostStore');
var userLoginMetadataStore = require('./stores/UserLoginMetadataStore');
var Unicycle = require('./Unicycle');
var MainScreenBanner = require('./MainScreenBanner');
var CreatePostForm = require('./Components/Post/CreatePostForm');
var ErrorPage = require('./Components/Common/ErrorPage');
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;

var {
  View,
  Text,
  StyleSheet,
  ActivityIndicatorIOS,
  NativeModules
} = React

var styles = StyleSheet.create({
  createPostPageContainer: {
    flex: 1
  },
  postUploadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  postUploadingMessage: {
    fontSize: 20,
    fontFamily: 'Futura-Medium'
  },
  spinner: {
    margin: 30
  },
  universityMessage: {
    color: 'purple',
    fontFamily: 'ChalkboardSE-Bold'
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
        postUploadedSuccessfully = createPostStore.getPostUploadedSuccessfully(),
        content = <View/>;

    if (isPostRequestInFlight) {
      content = this.renderPostUploadingContent();
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
    else if (postUploadedSuccessfully) {
      Unicycle.exec('setSelectedTab', 'home');
      Unicycle.exec('refreshHomeFeed', userLoginMetadataStore.getUserId());
    }

    return (
      <View style={styles.createPostPageContainer}>
        <MainScreenBanner
          title="Upload Photo"
          subTitle="An upload a day keeps the doctor away"/>
        { content }
      </View>
    )
  },

  showImagePicker: function() {
    Unicycle.exec('setIsImageUploading', true);

    UIImagePickerManager.showImagePicker(this._getImagePickerOptions(), (didCancel, response) => {
      if (!didCancel) {
        var uri = response.uri.replace('file://', '');
        Unicycle.exec('setWasImageSelected', true);
        Unicycle.exec('setImageUri', uri);

  			NativeModules.FileTransfer.upload(this._getImageUploadOptions(response), (err, res) => {
            var imageId = this._hackyWayToGetPictureIdFromDumbStringThatShouldBeAMap(res.data);
            Unicycle.exec('setImageId', imageId)
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
      maxWidth: 416, //TODO
      maxHeight: 416, //TODO
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
    return {
      uri: response.uri,
      uploadUrl: 'http://greedyapi.elasticbeanstalk.com/upload/photo',
      fileName: 'picture', //the name here has no meaning, it could really be anything
      mimeType: 'image/jpeg'
    };
  },

  //TODO: Fix this ugly shit and make it nice
  _hackyWayToGetPictureIdFromDumbStringThatShouldBeAMap: function(ugly) {
    var start = ugly.indexOf("pictureId") + 12;
    var end = ugly.indexOf("message") - 3;
    return ugly.substring(start, end);
  },

  //TODO: The universityMessage should come from the API
  renderPostUploadingContent: function() {
    return (
      <View style={styles.postUploadingContainer}>
        <Text style={styles.postUploadingMessage}>Post uploading to Youni</Text>
        <ActivityIndicatorIOS style={styles.spinner} />
        <Text style={styles.universityMessage}>Let's go Great Danes!</Text>
      </View>
    );
  }

});

module.exports = CreatePostPage;
