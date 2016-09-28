'use strict';

var React = require('react');
var ReactNative = require('react-native');

var Spinner = require('../Common/Spinner');

var ShowImagePicker = require('../CreatePost/ShowImagePicker');
var Colors = require('../../Utils/Common/Colors');
var campusChallengeStore = require('../../stores/campusChallenge/CampusChallengeStore');
var createPostStore = require('../../stores/CreatePostStore');

var {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    height: 35,
    width: Dimensions.get('window').width,
    alignItems: 'center',
    justifyContent: 'center'
  },
  label: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center'
  }
});

var ChallengeActionButton = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    var hasUserEnteredChallenge = campusChallengeStore.getHasLoggedInUserEnteredChallenge(),
        content;

    if (hasUserEnteredChallenge === null) {
      content = (
        <View>
          <Spinner color="white"/>
        </View>
      );
    }
    else if (hasUserEnteredChallenge) {
      content = (
        <Text style={styles.label}>
          View Submission
        </Text>
      );
    }
    else {
      content = (
        <Text style={styles.label}>
          Enter Challenge
        </Text>
      );
    }

    return (
      <TouchableHighlight
        style={[styles.container, { backgroundColor: Colors.getPrimaryAppColor() }]}
        underlayColor={Colors.getPrimaryAppColor()}
        onPress={this._onPress}>
        {content}
      </TouchableHighlight>
    );
  },

  _onPress: function() {
    var hasUserEnteredChallenge = campusChallengeStore.getHasLoggedInUserEnteredChallenge();

    if (hasUserEnteredChallenge === null) {
      return;
    }

    if (hasUserEnteredChallenge) {
      
    }
    else {
      createPostStore.setCampusChallengeIdString(campusChallengeStore.getCurrentChallenge().id);
      ShowImagePicker.showImagePicker(this.props.navigator);
    }
  }

});

module.exports = ChallengeActionButton;
