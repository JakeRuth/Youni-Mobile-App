'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');
var Unicycle = require('../../Unicycle');

var Spinner = require('../Common/Spinner');
var PrettyTouchable = require('../Common/PrettyTouchable');

var createPostStore = require('../../stores/CreatePostStore');
var campusChallengeStore = require('../../stores/campusChallenge/CampusChallengeStore');
var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Text,
  Switch,
  AlertIOS,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    paddingRight: 14,
    paddingLeft: 14,
    paddingTop: 8,
    paddingBottom: 8,
    marginBottom: 2
  },
  label: {
    flex: 1,
    color: Colors.DARK_GRAY,
    fontSize: 16,
    textAlign: 'left'
  },
  icon: {
    width: 20,
    height: 20,
    marginTop: 4,
    marginLeft: 2
  }
});

var SelectCampusChallenge = React.createClass({

  mixins: [
    Unicycle.listenTo(createPostStore)
  ],

  render: function() {
    if (campusChallengeStore.getNoCurrentChallenge()) {
      return <View/>;
    }
    else {
      return (
        <View>
          <View style={styles.container}>
            <Text style={styles.label}>
              Campus Challenge
            </Text>
            {this._renderButton()}
          </View>
          {this._renderAnonymousToggle()}
        </View>
      );
    }
  },

  _renderAnonymousToggle: function() {
    if (createPostStore.getCampusChallengeIdString()) {
      let submitAnonymously = createPostStore.getSubmitChallengeAnonymously();

      return (
        <View style={styles.container}>
          <Text style={styles.label}>
            Submit Challenge Anonymously
            <View style={styles.icon}>
              <Icon
                name='info'
                size={20}
                color={Colors.MED_GRAY}/>
            </View>
          </Text>

          <Switch
            value={submitAnonymously}
            onValueChange={() => createPostStore.setSubmitChallengeAnonymously(!submitAnonymously)}/>
        </View>
      );
    }
  },

  _renderButton: function() {
    return (
      <PrettyTouchable
        label={campusChallengeStore.getCurrentChallenge().name}
        containerStyle={{
          height: 34,
          paddingLeft: 12,
          paddingRight: 12
        }}
        invertColors={this._isButtonSelected()}
        onPress={this._onButtonPress}/>
    );
  },

  _onButtonPress: function() {
    var challengeId = createPostStore.getCampusChallengeIdString();

    if (campusChallengeStore.getHasLoggedInUserEnteredChallenge()) {
      AlertIOS.alert(
        'You have already entered this challenge.',
        'Limit one submission per student.',
        [
          {
            text: 'Okay'
          }
        ]
      );
    }
    else if (challengeId) {
      createPostStore.setCampusChallengeIdString('');
    }
    else {
      createPostStore.setCampusChallengeIdString(campusChallengeStore.getCurrentChallenge().id);
    }
  },
  
  _isButtonSelected: function() {
    return !campusChallengeStore.getHasLoggedInUserEnteredChallenge() && !createPostStore.getCampusChallengeIdString()
  }

});

module.exports = SelectCampusChallenge;
