'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Unicycle = require('../../Unicycle');

var CampusChallengeHeader = require('./CampusChallengeHeader');
var ChallengeCountdown = require('./ChallengeCountdown');
var ChallengeActionButtons = require('./ChallengeActionButtons');
var YouniHeader = require('../Common/YouniHeader');
var Spinner = require('../Common/Spinner');

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
    this._loadPage();
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
        <ChallengeActionButtons
          campusChallenge={challenge}
          navigator={this.props.navigator}/>
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
  },

  _loadPage: function() {
    let callback = () => {
      campusChallengeStore.requestLoggedInUserSubmissions();
    };
    campusChallengeStore.requestCurrentChallenge(callback);
  }

});

module.exports = CampusChallengePage;
