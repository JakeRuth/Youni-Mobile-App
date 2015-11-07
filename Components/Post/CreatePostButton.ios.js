'use strict';

var React = require('react-native');
var createPostStore = require('../../stores/CreatePostStore');
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;
var Unicycle = require('../../Unicycle');

var request = require('superagent');
var prefix = require('superagent-prefix')('http://localhost:8080/Greedy');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  NativeModules
} = React

var styles = StyleSheet.create({
  createPostButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  createPostButton: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#007C9E'
  },
  createPostText: {
    fontSize: 30,
    margin: 5
  },
  postCreatedMessage: {
    marginTop: 10,
    fontSize: 10
  },
  happyFace: {
    fontSize: 100,
    fontWeight: '500',
    color: '#007C9E'
  }
});

var CreatePostButton = React.createClass({

  render: function() {
    var postUploadedSuccessfullyMessage = <View/>
    if (createPostStore.getPostUploadedSuccessfully()) {
      Unicycle.exec('requestExploreFeed');
      postUploadedSuccessfullyMessage = (
        <View>
          <Text style={styles.postCreatedMessage}>Your post has been created!</Text>
          <Text style={styles.happyFace}>^_^</Text>
        </View>
      );
    }

    return (
      <View style={styles.createPostButtonContainer}>

        <TouchableHighlight
          style={styles.createPostButton}
          onPress={this.showImagePicker}
          underlayColor='#007C9E'>
          <Text style={styles.createPostText}>Create Post</Text>
        </TouchableHighlight>

        { postUploadedSuccessfullyMessage }
      </View>
    );
  },

  showImagePicker: function() {
    Unicycle.exec('setIsImageUploading', true);

    UIImagePickerManager.showImagePicker(this._getImagePickerOptions(), (didCancel, response) => {
      if (!didCancel) {
        var uri = response.uri.replace('file://', '');
        Unicycle.exec('setWasImageSelected', true);
        Unicycle.exec('setImageUri', uri);

  			NativeModules.FileTransfer.upload(this._getImageUploadOptions(response), (err, res) => {
          console.log(res.data)
            var imageId = this._hackyWayToGetPictureIdFromDumbStringThatShouldBeAMap(res.data);
            Unicycle.exec('setImageId', imageId)
            Unicycle.exec('setIsImageUploading', false);
      	});
      }
      else {
        Unicycle.exec('setIsImageUploading', false);
      }
    });
  },

  _getImagePickerOptions: function() {
    return {
      maxWidth: 640, //TODO
      maxHeight: 640, //TODO
      quality: 1.0, //TODO
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
      uploadUrl: 'http://localhost:8080/Greedy/upload/photo',
      fileName: 'picture', //the name here has no meaning, it could really be anything
      mimeType: 'image/jpeg'
    };
  },

  //TODO: Fix this ugly shit and make it nice
  _hackyWayToGetPictureIdFromDumbStringThatShouldBeAMap: function(ugly) {
    var start = ugly.indexOf("pictureId") + 12;
    var end = ugly.indexOf("message") - 3;
    return ugly.substring(start, end);
  }

});

module.exports = CreatePostButton;
