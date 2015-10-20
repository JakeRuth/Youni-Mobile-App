'use strict';

var React = require('react-native');
var Camera = require('react-native-camera');
var MainScreenBanner = require('./MainScreenBanner');
var Icon = require('react-native-vector-icons/Ionicons');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} = React

var styles = StyleSheet.create({
  uploadPhotoPageContainer: {
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  cameraSwitchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  switchCamera: {
    alignSelf: 'auto',
    marginRight: 15
  },
  emptyCameraCanvas: {
    flex: 1
  },
  takePictureContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 50
  }
});

var UploadPhotoPage = React.createClass({

  getInitialState() {
    return {
      cameraType: Camera.constants.Type.back
    }
  },

  render: function() {
    return (
    <View style={styles.uploadPhotoPageContainer}>
      <MainScreenBanner
        title="Upload Photo"
        subTitle="An upload a day keeps the doctor away"/>
      <Camera
        ref="cam"
        style={styles.container}
        type={this.state.welcome}>
          <TouchableHighlight onPress={this._switchCamera}>
            <View style={styles.cameraSwitchContainer}>
              <Icon style={styles.switchCamera}
                    name="ios-reverse-camera-outline"
                    size={50}
                    color="#007C9E" />
            </View>
          </TouchableHighlight>

          <View style={styles.emptyCameraCanvas} />

          <TouchableHighlight onPress={this._takePicture}>
            <View style={styles.takePictureContainer}>
              <Icon style={styles.switchCamera}
                    name="ios-camera-outline"
                    size={75}
                    color="#007C9E" />
            </View>
          </TouchableHighlight>
      </Camera>
    </View>
    )
  },

  _switchCamera() {
    var state = this.state;
    state.cameraType = state.cameraType === Camera.constants.Type.back
      ? Camera.constants.Type.front : Camera.constants.Type.back;
    this.setState(state);
  },

  _takePicture() {
    this.refs.cam.capture(function(err, data) {
      console.log(err, data);
    });
  }

});

module.exports = UploadPhotoPage;
