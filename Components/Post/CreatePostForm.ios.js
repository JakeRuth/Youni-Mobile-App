'use strict';

var React = require('react-native');
var createPostStore = require('../../stores/CreatePostStore');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var Unicycle = require('../../Unicycle');

var {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableHighlight,
  ActivityIndicatorIOS
} = React

var styles = StyleSheet.create({
  postFormContainer: {
    flex: 1,
    alignItems: 'center'
  },
  postImage: {
    width: 320,
    height: 320
  },
  captionInput: {
    margin: 10,
    paddingLeft: 10,
    paddingRight: 10,
    height: 45,
    borderRadius: 10,
    borderColor: 'gray',
    borderWidth: 1
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
  spinnerContainer: {
    flex: 1,
    alignItems: 'center'
  }
});

var CreatePostForm = React.createClass({

  propTypes: {
    imageUri: React.PropTypes.string.isRequired
  },

  render: function() {
    var imageId = createPostStore.getImageId(),
        button;

    if (imageId) {
      button = (
        <TouchableHighlight onPress={this._onSubmitPost} style={styles.createPostButton}>
          <Text style={styles.createPostText}>Post to Youni</Text>
        </TouchableHighlight>
      );
    }
    else {
      button = (
        <View style={styles.spinnerContainer}>
          <ActivityIndicatorIOS/>
          <Text>Image uploading...</Text>
        </View>
      );
    }

    return (
      <View style={styles.postFormContainer}>
        <Image style={styles.postImage} source={{uri: this.props.imageUri, isStatic: true}} />

        <TextInput
          style={styles.captionInput}
          onChangeText={(text) => Unicycle.exec('setCaption', text)}
          value={createPostStore.getCaption()}
          autoFocus={true}
          multiline={true}
          maxLength={183} //TODO: think about this value more, is this a just limit?
          numberOfLines={2}
          textAlign={'center'}
        />

        { button }
      </View>
    );
  },

  _onSubmitPost: function() {
    var userId = userLoginMetadataStore.getUserId(),
        pictureId = createPostStore.getImageId(),
        caption = createPostStore.getCaption();
    Unicycle.exec('createPost', userId, pictureId, caption);
  }

});

module.exports = CreatePostForm;
