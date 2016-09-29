'use strict';

var React = require('react');
var ReactNative = require('react-native');

var PastChallengeBannerListItem = require('./PastChallengeBannerListItem');

var Colors = require('../../Utils/Common/Colors');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var {
  View,
  Text,
  StyleSheet,
  ScrollView
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingBottom: 10
  },
  header: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  label: {
    flex: 1,
    fontSize: 18
  },
  seeAllLink: {
    color: Colors.MED_GRAY,
    fontSize: 14
  }
});

var MAX_CHALLENGES_TO_SHOW = 5;
var PastChallengesBanner = React.createClass({
  
  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      pastChallenges: []
    };
  },

  componentDidMount: function() {
    this._requestPastChallenges();
  },

  render: function() {
    if (!this.state.pastChallenges.length) {
      return <View/>;
    }

    return (
      <View style={styles.container}>

        <View style={styles.header}>
          <Text style={[styles.label, { color: Colors.getPrimaryAppColor() }]}>
            Past
          </Text>
          <Text style={styles.seeAllLink}>
            See All
          </Text>
        </View>

        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          automaticallyAdjustContentInsets={false}>
          {this._renderListItems()}
        </ScrollView>

      </View>
    );
  },

  _renderListItems: function() {
    var challenges = this.state.pastChallenges,
        elements = [];

    for (let i = 0; i < challenges.length; i++) {
      elements.push(
        <PastChallengeBannerListItem
          key={i}
          challenge={challenges[i]}
          navigator={this.props.navigator}/>
      );
    }
    return elements;
  },

  _requestPastChallenges: function() {
    var that = this;

    AjaxUtils.ajax(
      '/campusChallenge/fetchFinishedChallengesForNetwork',
      {
        networkName: userLoginMetadataStore.getNetworkName(),
        userEmail: userLoginMetadataStore.getEmail(),
        fetchOffset: 0,
        maxToFetch: MAX_CHALLENGES_TO_SHOW
      },
      (res) => {
        that.setState({
          pastChallenges: res.body.challenges
        });
      },
      () => { }
    );
  }

});

module.exports = PastChallengesBanner;
