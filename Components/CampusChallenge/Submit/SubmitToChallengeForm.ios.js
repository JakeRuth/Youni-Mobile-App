'use strict';

var React = require('react');
var ReactNative = require('react-native');

var SubmitChallengeImage = require('./SubmitChallengeImage');
var AnonymousSubmissionToggle = require('./AnonymousSubmissionToggle');
var SubmitChallengeButton = require('./SubmitChallengeButton');

var Colors = require('../../../Utils/Common/Colors');
var AjaxUtils = require('../../../Utils/Common/AjaxUtils');

var campusChallengeStore = require('../../../stores/campusChallenge/CampusChallengeStore');
var userLoginMetadataStore = require('../../../stores/UserLoginMetadataStore');

var {
  View,
  Text,
  AlertIOS,
  StyleSheet,
  TextInput,
  Keyboard,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12
  },
  inputContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginBottom: 50
  },
  input: {
    backgroundColor: 'white',
    textAlign: 'center',
    color: Colors.DARK_GRAY,
    fontSize: 22
  },
  submitButtonContainer: {
    position: 'absolute',
    bottom: 0
  }
});

var SubmitToChallengeForm = React.createClass({

  DEFAULT_INPUT_HEIGHT: 30,
  MAX_INPUT_HEIGHT: 100,

  propTypes: {
    campusChallenge: React.PropTypes.object.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      imageUri: null,
      pictureId: null,
      submitAnonymously: false,
      caption: '',
      inputHeight: this.DEFAULT_INPUT_HEIGHT,
      keyboardPadding: 0
    };
  },

  componentWillMount: function() {
    Keyboard.addListener('keyboardDidShow', (e) => {
      this.setState({
        keyboardPadding: e.endCoordinates.height
      });
    });
    Keyboard.addListener('keyboardDidHide', (e) => {
      this.setState({
        keyboardPadding: 0
      });
    });
  },

  componentWillUnmount: function() {
    Keyboard.removeListener('keyboardDidShow');
    Keyboard.removeListener('keyboardDidHide');
  },

  render: function () {
    return (
      <View style={{flex: 1}}>
        <View style={[styles.container, { marginBottom: this.state.keyboardPadding }]}>

          <SubmitChallengeImage
            style={{flex: 3}}
            imageUri={this.state.imageUri}
            getImageCallback={this.getImageCallback}
            uploadImageCallback={this.uploadImageCallback}/>

          <View style={{flex: 2}}>
            <AnonymousSubmissionToggle
              submitAnonymously={this.state.submitAnonymously}
              onValueChange={() => this.setState({ submitAnonymously: !this.state.submitAnonymously })}/>
            {this._renderCaptionInput()}
          </View>

        </View>
        
        <SubmitChallengeButton
          style={styles.submitButtonContainer}
          campusChallenge={this.props.campusChallenge}
          isLoading={this.isImageUploadingToServer()}
          onPress={this.onSubmitPress}/>
      </View>
    );
  },

  _renderCaptionInput: function() {
    return (
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { height: this.state.inputHeight }]}
          value={this.state.caption}
          placeholder='Add Caption...'
          placeholderTextColor={Colors.MED_GRAY}
          maxLength={200}
          multiline={true}
          keyboardType='twitter'
          onChangeText={ (caption) => {
            this.setState({
              caption: caption
            });
          }}
          onChange={(event) => {
            let height = event.nativeEvent.contentSize.height;
            this.setState({
              inputHeight: height > this.MAX_INPUT_HEIGHT ? this.MAX_INPUT_HEIGHT : height
            });
          }}/>
      </View>
    );
  },

  isImageUploadingToServer: function() {
    return this.state.imageUri && !this.state.pictureId;
  },

  getImageCallback: function(imageUri) {
    this.setState({
      imageUri: imageUri
    });
  },

  uploadImageCallback: function(pictureId) {
    this.setState({
      pictureId: pictureId
    });
  },

  onSubmitPress: function() {
    if (!this.state.pictureId && !this.isImageUploadingToServer()) {
      AlertIOS.alert(
        'You must upload a photo before entering the challenge.',
        '',
        [
          {
            text: 'Okay'
          }
        ]
      );
    }
    // make sure all required parameters exist
    else {
      this._submit();
    }
  },
  
  _submit: function() {
    var that = this;

    AjaxUtils.ajax(
      '/campusChallenge/submit',
      {
        campusChallengeIdString: this.props.campusChallenge.id,
        userEmail: userLoginMetadataStore.getEmail(),
        pictureIdString: this.state.pictureId,
        caption: this.state.caption,
        submitChallengeAnonymously: this.state.submitAnonymously
      },
      (res) => {
        this.props.navigator.pop();
        let callback = () => {
          campusChallengeStore.requestLoggedInUserSubmissions();
        };
        campusChallengeStore.requestCurrentChallenge(callback);
      },
      () => {
        AlertIOS.alert(
          'Error submitting to challenge',
          'If this problem persists please contact support@youniapp.com',
          [
            {
              text: 'Okay'
            }
          ]
        );
      }
    );
  }

});

module.exports = SubmitToChallengeForm;
