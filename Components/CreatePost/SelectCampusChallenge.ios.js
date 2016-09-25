'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');
var Unicycle = require('../../Unicycle');

var Spinner = require('../Common/Spinner');
var PrettyTouchable = require('../Common/PrettyTouchable');

var createPostStore = require('../../stores/CreatePostStore');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var Colors = require('../../Utils/Common/Colors');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');

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

  getInitialState: function () {
    return {
      campusChallenge: null,
      isLoading: true,
      hasUserEnteredChallenge: null,
      noCurrentChallenge: null
    };
  },

  componentDidMount: function() {
    this._requestCurrentChallenge();
  },

  mixins: [
    Unicycle.listenTo(createPostStore)
  ],

  render: function() {
    if (this.state.noCurrentChallenge) {
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
    if (this.state.isLoading) {
      return <Spinner/>;
    }
    else {
      return (
        <PrettyTouchable
          label={this.state.campusChallenge.name}
          containerStyle={{
            height: 34,
            paddingLeft: 12,
            paddingRight: 12
          }}
          invertColors={this.state.hasUserEnteredChallenge && !createPostStore.getCampusChallengeIdString()}
          onPress={this._onButtonPress}/>
      );
    }
  },

  _onButtonPress: function() {
    var challengeId = createPostStore.getCampusChallengeIdString();

    if (this.state.hasUserEnteredChallenge) {
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
      createPostStore.setCampusChallengeIdString(this.state.campusChallenge.id);
    }
  },

  _requestCurrentChallenge: function() {
    var that = this;

    this.setState({
      isLoading: true
    });

    AjaxUtils.ajax(
      '/campusChallenge/getCurrentForNetwork',
      {
        networkName: userLoginMetadataStore.getNetworkName()
      },
      (res) => {
        that.setState({
          campusChallenge: res.body.challenge,
          noCurrentChallenge: res.body.isChallengeEmpty
        });
        if (res.body.challenge.id) {
          that._hasUserAlreadyEnteredChallenge(res.body.challenge.id);
        }
      },
      () => {

      }
    );
  },

  _hasUserAlreadyEnteredChallenge: function(challengeId) {
    var that = this;

    AjaxUtils.ajax(
      '/campusChallenge/hasUserEntered',
      {
        campusChallengeIdString: challengeId,
        userEmail: userLoginMetadataStore.getEmail()
      },
      (res) => {
        that.setState({
          hasUserEnteredChallenge: res.body.userEnteredChallenge,
          isLoading: false
        });
      },
      () => {
        that.setState({
          isLoading: false
        });
      }
    );
  }

});

module.exports = SelectCampusChallenge;
