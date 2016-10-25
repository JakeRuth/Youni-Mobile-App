'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');

var NoMoreSubmissionsToVoteOnPage = require('../CampusChallenge/Voting/NoMoreSubmissionsToVoteOnPage');
var YouniHeader = require('../Common/YouniHeader');
var BackArrow = require('../Common/BackArrow');

var Colors = require('../../Utils/Common/Colors');
var NonSwipeBackablePage = require('../../Utils/Enums/NonSwipeBackablePage');
var hackyNonSwipeBackablePageStore = require('../../stores/common/HackyNonSwipeBackablePageStore');

var {
  View,
  Text,
  AlertIOS,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  pageHeader: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center'
  },
  helpIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingTop: 29,
    paddingRight: 12,
    paddingLeft: 30,
    paddingBottom: 15,
    backgroundColor: 'transparent'
  }
});

var CampusChallengeVotingPopup = React.createClass({

  propTypes: {
    campusChallenge: React.PropTypes.object.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  componentDidMount: function() {
    hackyNonSwipeBackablePageStore.setPage(NonSwipeBackablePage.CHALLENGE_SUBMISSION_VOTING_CARD_SLIDE);
  },

  componentWillUnmount: function() {
    hackyNonSwipeBackablePageStore.hidePage();
  },

  render: function () {
    return (
      <View style={styles.container}>
        
        <YouniHeader style={{backgroundColor: Colors.getPrimaryAppColor()}}>
          <Text style={styles.pageHeader}>
            {this.props.campusChallenge.name}
          </Text>
          <BackArrow
            color="white"
            onPress={() => {
              this.props.navigator.pop();
              // allow time for pop navigation to take place
              setTimeout(() => {
                hackyNonSwipeBackablePageStore.hidePage();
              }, 100);
            }}/>
          <Icon
            style={styles.helpIcon}
            onPress={this.onHelpIconPress}
            name='help'
            size={25}
            color="white"/>
        </YouniHeader>

        {/*
          * HACK!!!!
          * 
          * Due to these facts:
          * - once the Navigator is mounted you cannot change it's scene navigation gestures (animations)
          * - Failed on multiple other attempts using Modal, store for the edgeHitWidth, and other things this was the only solution I could find
          * 
          * The real visible component that should be here is actually rendered hackily using stores and
          * is rendered in LoggedInUserBasePage component.
          * Again, the whole reason this is done is to 'disable' the swipe back page navigator functionality.
          * 
          */}
        <NoMoreSubmissionsToVoteOnPage {...this.props}/>
        
      </View>
    );
  },

  onHelpIconPress: function() {
    AlertIOS.alert(
      this.props.campusChallenge.name,
      this.props.campusChallenge.description,
      [
        {
          text: 'Okay'
        }
      ]
    );
  }

});

module.exports = CampusChallengeVotingPopup;
