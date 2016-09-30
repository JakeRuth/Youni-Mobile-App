'use strict';

var React = require('react');
var ReactNative = require('react-native');

var PastChallengeWinnersListItem = require('../CampusChallenge/PastChallengeWinnersListItem');
var YouniHeader = require('../Common/YouniHeader');
var BackArrow = require('../Common/BackArrow');
var LoadMoreButton = require('../Common/LoadMoreButton');

var Colors = require('../../Utils/Common/Colors');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var {
  View,
  Text,
  ScrollView,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  pageHeaderLabel: {
    fontSize: 20,
    fontWeight: '500',
    color: 'white',
    textAlign: 'center'
  }
});

var PastChallengeWinnersPopup = React.createClass({

  PAGE_SIZE: 40,

  propTypes: {
    pastChallenges: React.PropTypes.array.isRequired,
    navigator: React.PropTypes.object.isRequired
  },
  
  getInitialState: function() {
    return {
      challenges: this.props.pastChallenges,
      moreToFetch: false,
      offset: this.props.pastChallenges.length,
      isLoading: false
    };
  },

  componentDidMount: function() {
    this.fetchPastChallenges();
  },

  render: function () {
    var challenges = this.state.challenges,
        challengeElements = [];

    for (var i = 0; i < challenges.length; i++) {
      challengeElements.push(
        <PastChallengeWinnersListItem
          key={i}
          challenge={challenges[i]}
          navigator={this.props.navigator}/>
      );
    }

    return (
      <View style={styles.container}>

        <YouniHeader style={{backgroundColor: Colors.getPrimaryAppColor()}}>
          <Text style={styles.pageHeaderLabel}>
            Past Challenge Winners
          </Text>
          <BackArrow
            color="white"
            onPress={() => this.props.navigator.pop()}/>
        </YouniHeader>

        <ScrollView
          style={{flex: 1}}
          automaticallyAdjustContentInsets={false}>
          {challengeElements}
          <LoadMoreButton
            onPress={this.fetchPastChallenges}
            isLoading={this.state.isLoading}
            isVisible={this.state.moreToFetch}/>
        </ScrollView>

      </View>
    );
  },
  
  fetchPastChallenges: function() {
    var that = this,
        currentOffset = this.state.offset,
        currChallenges = this.state.challenges;

    this.setState({
      isLoading: true
    });

    AjaxUtils.ajax(
      '/campusChallenge/fetchFinishedChallengesForNetwork',
      {
        networkName: userLoginMetadataStore.getNetworkName(),
        userEmail: userLoginMetadataStore.getEmail(),
        fetchOffset: currentOffset,
        maxToFetch: this.PAGE_SIZE
      },
      (res) => {
        this.setState({
          challenges: currChallenges.concat(res.body.challenges),
          offset: currentOffset + that.PAGE_SIZE,
          moreToFetch: res.body.moreToFetch,
          isLoading: false
        });
      },
      () => {
        this.setState({
          isLoading: false
        });
      }
    );
  }
});

module.exports = PastChallengeWinnersPopup;
