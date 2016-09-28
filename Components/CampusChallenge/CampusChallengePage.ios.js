'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Unicycle = require('../../Unicycle');

var ActiveCampusChallenge = require('./ActiveCampusChallenge');
var YouniHeader = require('../Common/YouniHeader');
var Spinner = require('../Common/Spinner');

var Colors = require('../../Utils/Common/Colors');
var campusChallengeStore = require('../../stores/campusChallenge/CampusChallengeStore');

var {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableHighlight
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
      content = (
        <View style={styles.centerAll}>
          <Spinner/>
        </View>
      );
    }
    else if (campusChallengeStore.getNoCurrentChallenge()) {
      content = (
        <View style={styles.centerAll}>
          <Text style={styles.noCampusChallengeMessage}>
            There are no active campus challenges, please check back soon!
          </Text>
        </View>
      );
    }
    else {
      content = (
        <ActiveCampusChallenge
          challenge={campusChallengeStore.getCurrentChallenge()}
          challengeSubmissions={campusChallengeStore.getSubmissions()}
          handleScroll={this.handleScroll}
          navigator={this.props.navigator}/>
      );
    }

    return (
      <View style={styles.container}>

        <YouniHeader color={Colors.getPrimaryAppColor()}>
          <Text style={styles.pageHeader}>
            Campus Challenge
          </Text>
        </YouniHeader>

        {content}

      </View>
    );
  },

  handleScroll(e) {
    var infiniteScrollThreshold = -1;

    if (e.nativeEvent.contentOffset.y < infiniteScrollThreshold) {
      campusChallengeStore.reInit();
      this._loadPage();
    }
  },

  _loadPage: function() {
    let callback = () => {
      campusChallengeStore.fetchSubmissions(true);
      campusChallengeStore.requestHasLoggedInUserEnteredChallenge();
    };
    campusChallengeStore.requestCurrentChallenge(callback);
  }

});

module.exports = CampusChallengePage;
