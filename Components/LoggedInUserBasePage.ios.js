'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Unicycle = require('../Unicycle');

var YouniNavigator = require('./Common/YouniNavigator');
var ChallengeSubmissionVotingCardSlider = require('./CampusChallenge/Voting/ChallengeSubmissionVotingCardSlider');

var NonSwipeBackablePage = require('../Utils/Enums/NonSwipeBackablePage');
var hackyNonSwipeBackablePageStore = require('../stores/common/HackyNonSwipeBackablePageStore');

var {
  View,
  StyleSheet,
  Dimensions
} = ReactNative;

let {width, height} = Dimensions.get('window');

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  nonSwipeBackablePageContainer: {
    backgroundColor: 'white',
    width: width,
    height: height - 64, // height of YouniHeader
    position: 'absolute',
    top: 64
  }
});

var LoggedInUserBasePage = React.createClass({

  mixins: [
    Unicycle.listenTo(hackyNonSwipeBackablePageStore)
  ],

  render: function() {
    var nonSwipeBackablePage;

    switch (hackyNonSwipeBackablePageStore.getCurrentVisiblePage()) {
      case NonSwipeBackablePage.CHALLENGE_SUBMISSION_VOTING_CARD_SLIDE:
        nonSwipeBackablePage = (
          <View style={styles.nonSwipeBackablePageContainer}>
            <ChallengeSubmissionVotingCardSlider/>
          </View>
        );
    }

    return (
      <View style={styles.container}>
        
        <YouniNavigator
          initialRoute={{
            component: require('./LandingPage')
          }}
          renderScene={(route, navigator) => React.createElement(route.component, { navigator, ...route.passProps }) }/>

        {nonSwipeBackablePage}
        
      </View>
    );
  }

});

module.exports = LoggedInUserBasePage;
