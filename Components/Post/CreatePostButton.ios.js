'use strict';

var React = require('react-native');
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;

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
  }
});

var CreatePostButton = React.createClass({

  render: function() {
    return (
      <View style={styles.createPostButtonContainer}>
        <TouchableHighlight
          style={styles.createPostButton}
          onPress={this.showImagePicker}
          underlayColor='#007C9E'>

          <Text style={styles.createPostText}>Create Post</Text>

        </TouchableHighlight>
      </View>
    );
  },

  showImagePicker: function() {
    UIImagePickerManager.showImagePicker(this._getImagePickerOptions(), (didCancel, response) => {
      if (!didCancel) {
  			NativeModules.FileTransfer.upload(this._getImageUploadOptions(response), (err, res) => {
    	      //do something with the response`
      	});
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
  }

});

module.exports = CreatePostButton;
