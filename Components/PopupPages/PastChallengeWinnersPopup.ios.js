'use strict';

var React = require('react');
var ReactNative = require('react-native');

var PastChallengeWinnersListItem = require('../CampusChallenge/PastChallengeWinnersListItem');
var YouniHeader = require('../Common/YouniHeader');
var BackArrow = require('../Common/BackArrow');
var Spinner = require('../Common/Spinner');
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
  },
  noChallengesMessageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  noChallengesMessage: {
    textAlign: 'center',
    color: Colors.DARK_GRAY,
    fontSize: 16
  }
});

var PastChallengeWinnersPopup = React.createClass({

  PAGE_SIZE: 40,

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },
  
  getInitialState: function() {
    return {
      challenges: [],
      moreToFetch: false,
      offset: 0,
      isLoadingFirstPage: false,
      isLoadingNextPage: false
    };
  },

  componentDidMount: function() {
    this.fetchPastChallenges();
  },

  render: function () {
    var content;

    if (this.state.isLoadingFirstPage) {
      content = <Spinner/>;
    }
    else if (this.state.challenges.length === 0) {
      content = (
        <View style={styles.noChallengesMessageContainer}>
          <Text style={styles.noChallengesMessage}>
            No Past Challenges
          </Text>
        </View>
      )
    }
    else {
      content = this._renderPastChallenges();
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

        {content}

      </View>
    );
  },

  _renderPastChallenges: function() {
    var challengeElements = [];

    for (var i = 0; i < this.state.challenges.length; i++) {
      challengeElements.push(
        <PastChallengeWinnersListItem
          key={i}
          campusChallenge={this.state.challenges[i]}
          navigator={this.props.navigator}/>
      );
    }

    return (
      <ScrollView
        style={{flex: 1}}
        automaticallyAdjustContentInsets={false}>
        {challengeElements}
        <LoadMoreButton
          onPress={this.fetchPastChallenges}
          isLoading={this.state.isLoadingNextPage}
          isVisible={this.state.moreToFetch}/>
      </ScrollView>
    );
  },
  
  fetchPastChallenges: function() {
    var that = this,
        currentOffset = this.state.offset,
        currChallenges = this.state.challenges;

    if (this.state.offset === 0) {
      this.setState({
        isLoadingFirstPage: true
      });
    }
    else {
      this.setState({
        isLoadingNextPage: true
      });
    }

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
          isLoadingFirstPage: false,
          isLoadingNextPage: false
        });
      },
      () => {
        this.setState({
          isLoadingFirstPage: false,
          isLoadingNextPage: false
        });
      }
    );
  }
});

module.exports = PastChallengeWinnersPopup;
