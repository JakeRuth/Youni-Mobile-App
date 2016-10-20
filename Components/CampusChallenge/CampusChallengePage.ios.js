'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');
var Unicycle = require('../../Unicycle');

var CampusChallengeHeader = require('./CampusChallengeHeader');
var ChallengeCountdown = require('./ChallengeCountdown');
var ChallengeActionButton = require('./ChallengeActionButton');
var PastChallengeWinnersPopup = require('../PopupPages/PastChallengeWinnersPopup');
var YouniHeader = require('../Common/YouniHeader');
var Spinner = require('../Common/Spinner');
var NotificationIcon = require('../Notification/NotificationIcon');

var Colors = require('../../Utils/Common/Colors');
var campusChallengeStore = require('../../stores/campusChallenge/CampusChallengeStore');

var {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  pageHeader: {
    flex: 1,
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    color: 'white'
  },
  notificationIcon: {
    position: 'absolute',
    left: 0,
    top: 0,
    paddingTop: 26,
    paddingLeft: 16,
    paddingRight: 30,
    paddingBottom: 15
  },
  viewPastChallengesIcon: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    right: 0,
    paddingTop: 25,
    paddingRight: 12,
    paddingLeft: 30,
    paddingBottom: 15
  },
  centerAll: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  challengeContainer: {
    flex: 1,
    marginBottom: 35
  },
  coverPhoto: {
    width: Dimensions.get('window').width,
    height: 138
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: 'row',
    maxHeight: 150
  },
  enterChallengeButton: {
    marginLeft: 5,
    marginRight: 2.5
  },
  voteButton: {
    marginRight: 5,
    marginLeft: 2.5
  },
  noCampusChallengeMessage: {
    color: Colors.DARK_GRAY,
    fontSize: 16,
    textAlign: 'center'
  }
});

var CampusChallengePage = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

  mixins: [
    Unicycle.listenTo(campusChallengeStore)
  ],
  
  componentDidMount: function() {
    campusChallengeStore.requestCurrentChallenge();
  },

  render: function() {
    var content,
        currentChallenge = campusChallengeStore.getCurrentChallenge();

    if (campusChallengeStore.isLoadingCurrentChallenge()) {
      content = this._renderSpinner();
    }
    else if (campusChallengeStore.getNoCurrentChallenge()) {
      content = this._renderNoChallengeMessage();
    }
    else {
      content = this._renderCampusChallenge();
    }

    return (
      <View style={styles.container}>

        <YouniHeader color={Colors.getPrimaryAppColor()}>
          <Text style={styles.pageHeader}>
            Youni Challenge
          </Text>
          <Icon
            style={styles.viewPastChallengesIcon}
            name="equalizer"
            size={30}
            color="white"
            onPress={() => {
              this.props.navigator.push({
                component: PastChallengeWinnersPopup
              });
            }}/>
          <NotificationIcon
            style={styles.notificationIcon}
            navigator={this.props.navigator}/>
        </YouniHeader>

        {content}

      </View>
    );
  },

  _renderCampusChallenge: function() {
    let challenge = campusChallengeStore.getCurrentChallenge();

    return (
      <View style={styles.challengeContainer}>

        <CampusChallengeHeader
          campusChallenge={challenge}
          navigator={this.props.navigator}/>
        <Image
          style={styles.coverPhoto}
          resizeMode="cover"
          source={{uri: challenge.coverPhotoUrl}}/>
        <ChallengeCountdown
          days={challenge.daysRemaining}
          hours={challenge.hoursRemaining}
          minutes={challenge.minutesRemaining}
          seconds={challenge.secondsRemaining}/>

        <View style={styles.buttonsContainer}>
          <ChallengeActionButton
            style={styles.enterChallengeButton}
            label="Enter"
            iconName="photo-camera"
            onPress={() => {
              this.props.navigator.push({
                component: require('../PopupPages/SubmitCampusChallengePopup'),
                passProps: {
                  campusChallenge: challenge,
                  goBackNPagesAfterSuccessfulSubmit: 1,
                  ...this.props
                }
              });
            }}/>
          <ChallengeActionButton
            style={styles.voteButton}
            label="Vote"
            iconName="arrow-upward"
            onPress={() => {
              this.props.navigator.push({
                component: require('../PopupPages/CampusChallengeVotingPopup'),
                passProps: {
                  campusChallenge: challenge
                }
              });
            }}/>
        </View>

      </View>
    );
  },

  _renderSpinner: function() {
    return (
      <View style={styles.centerAll}>
        <Spinner/>
      </View>
    );
  },

  _renderNoChallengeMessage: function() {
    return (
      <View style={styles.centerAll}>
        <Text style={styles.noCampusChallengeMessage}>
          There are no active campus challenges, please check back soon!
        </Text>
      </View>
    );
  }

});

module.exports = CampusChallengePage;
