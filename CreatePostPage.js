'use strict';

var React = require('react-native');
var createPostStore = require('./stores/CreatePostStore');
var Unicycle = require('./Unicycle');
var MainScreenBanner = require('./MainScreenBanner');
var CreatePostButton = require('./Components/Post/CreatePostButton');
var CreatePostForm = require('./Components/Post/CreatePostForm');

var {
  View,
  Text,
  StyleSheet,
  ActivityIndicatorIOS
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

  render: function() {
    var isImageUploading = createPostStore.getIsImageUploading(),
        wasImageSelected = createPostStore.getWasImageSelected(),
        isPostRequestInFlight = createPostStore.isRequestInFlight(),
        content;

    if (isPostRequestInFlight) {
      content = this.renderPostUploadingContent();
    }
    else if (wasImageSelected) {
      var uri = createPostStore.getImageUri();
      content = <CreatePostForm imageUri={uri} />
    }
    else {
      content = <CreatePostButton/>
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
