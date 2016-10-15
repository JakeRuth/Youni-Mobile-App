'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');

var ShowSubmitChallengeImagePicker = require('./ShowSubmitChallengeImagePicker');

var Colors = require('../../../Utils/Common/Colors');

var {
  View,
  Image,
  StyleSheet,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  imageSelector: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.LIGHT_GRAY,
    borderRadius: 8
  },
  image: {
    backgroundColor: Colors.LIGHT_GRAY,
    borderRadius: 8
  }
});

var SubmitChallengeImage = React.createClass({

  propTypes: {
    imageUri: React.PropTypes.string,
    getImageCallback: React.PropTypes.func.isRequired,
    uploadImageCallback: React.PropTypes.func.isRequired
  },

  render: function () {
    if (this.props.imageUri) {
      return (
        <Image
          style={[styles.image, this.props.style]}
          resizeMode="contain"
          source={{uri: this.props.imageUri, isStatic: true}}/>
      );
    }
    else {
      return (
        <TouchableHighlight
          style={[styles.imageSelector, this.props.style]}
          underlayColor={Colors.LIGHT_GRAY}
          onPress={() => ShowSubmitChallengeImagePicker.showImagePicker(this.props.getImageCallback, this.props.uploadImageCallback)}>
          <View>
            <Icon
              name='photo-camera'
              size={80}
              color={Colors.MED_GRAY}/>
          </View>
        </TouchableHighlight>
      );
    }
  }

});

module.exports = SubmitChallengeImage;
