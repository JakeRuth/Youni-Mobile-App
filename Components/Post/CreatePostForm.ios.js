'use strict';

var React = require('react-native');
var createPostStore = require('../../stores/CreatePostStore');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var Unicycle = require('../../Unicycle');
var Spinner = require('../Common/Spinner');

var {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableHighlight
} = React

var styles = StyleSheet.create({
  postFormContainer: {
    flex: 1,
    padding: 5
  },
  postInformation: {
    flex: 1,
    flexDirection: 'row'
  },
  postImage: {
    width: 110,
    height: 110
  },
  captionInput: {
    flex: 1,
    height: 110,
    marginLeft: 6,
    padding: 5,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 1
  },
  createPostButton: {
    alignSelf: 'center',
    backgroundColor: '#0083D4',
    borderRadius: 1,
    margin: 10,
    marginBottom: 0
  },
  createPostText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
    margin: 5
  },
  cancelText: {
    textAlign: 'center',
    fontSize: 10,
    padding: 15,
    paddingTop: 5,
    color: '#FF7878'
  },
  uploadStatus: {
    alignItems: 'center'
  }
});

var CreatePostForm = React.createClass({

  propTypes: {
    imageUri: React.PropTypes.string.isRequired
  },

  render: function() {
    var imageUploadedSuccessfully = createPostStore.getImageId(),
        postButton;

    if (imageUploadedSuccessfully) {
      postButton = (
        <TouchableHighlight
          style={styles.createPostButton}
          onPress={this._onSubmitPost}>
          <Text style={styles.createPostText}>Post to Youni</Text>
        </TouchableHighlight>
      );
    }
    else {
      postButton = (
        <View style={styles.uploadStatus}>
          <Spinner/>
          <Text>Image uploading...</Text>
        </View>
      );
    }

    return (
      <ScrollView>
        <View style={styles.postFormContainer}>

          <View style={styles.postInformation}>
            <Image
              style={styles.postImage}
              source={{uri: this.props.imageUri, isStatic: true}} />
            <TextInput
              style={styles.captionInput}
              onChangeText={(text) => Unicycle.exec('setCaption', text)}
              value={createPostStore.getCaption()}
              multiline={true}
              maxLength={185}/>
          </View>

          <View style={styles.actionButtons}>
            {postButton}
            <Text
              style={styles.cancelText}
              onPress={this._onCancelTextClick} >
              Cancel
            </Text>
          </View>

        </View>
      </ScrollView>
    );
  },

  _onSubmitPost: function() {
    var userId = userLoginMetadataStore.getUserId(),
        pictureId = createPostStore.getImageId(),
        caption = createPostStore.getCaption();
    Unicycle.exec('createPost', userId, pictureId, caption);
  },

  _onCancelTextClick: function() {
    Unicycle.exec('setWasImageSelected', false);
    Unicycle.exec('setCaption', '');
    Unicycle.exec('setSelectedTab', 'home');
  }

});

module.exports = CreatePostForm;
