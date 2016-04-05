'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var Icon = require('react-native-vector-icons/Ionicons');
var trendingStore = require('../../stores/trending/TrendingStore');
var MainScreenBanner = require('../../MainScreenBanner');
var TrendingUsersList = require('./TrendingUsersList');
var ErrorPage = require('../Common/ErrorPage');
var TrendingPageSelector = require('./TrendingPageSelector');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  AlertIOS
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 50
  },
  aboutTrendingPageIconContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 19
  }
});

var TrendingPage = React.createClass({

  currentFeed: 'Daily',
  weeklyFeed: 'Weekly',
  allTimeFeed: 'All Time',

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

  mixins: [
    Unicycle.listenTo(trendingStore)
  ],

  componentDidMount: function() {
    Unicycle.exec('getCurrentTrendingUsers');
  },

  getInitialState: function() {
    return {
      selectedFeed: this.currentFeed
    };
  },

  render: function() {
    var isRequestInFlight = trendingStore.isRequestInFlight(),
        anyErrorsLoadingPage = trendingStore.anyErrorsLoadingPage(),
        errorPage;

    if (anyErrorsLoadingPage) {
      errorPage = <ErrorPage reloadButtonAction={this._onErrorPageReload}/>
    }

    return (
      <View style={styles.container}>

        <MainScreenBanner title='Trending'/>
        <TrendingPageSelector
          selectedFeed={this.state.selectedFeed}
          currentFeed={this.currentFeed}
          weeklyFeed={this.weeklyFeed}
          allTimeFeed={this.allTimeFeed}
          changeFeedSelector={(feed) => { this._changeFeedSelector(feed) }}/>

        {errorPage}

        <TrendingUsersList
          users={this._getTrendingUsers(this.state.selectedFeed)}
          isPageLoading={trendingStore.isRequestInFlight()}
          onPageRefresh={() => { this._requestTrendingUsers(this.state.selectedFeed) }}
          navigator={this.props.navigator}/>

        {this._renderAboutTrendingPageIcon()}

      </View>
    );
  },

  _renderAboutTrendingPageIcon: function() {
    return (
      <TouchableHighlight
        style={styles.aboutTrendingPageIconContainer}
        underlayColor={'transparent'}
        onPress={this._aboutTrendingPageIconPress}>

        <Icon
          name='information-circled'
          size={23}
          color={'white'}/>

      </TouchableHighlight>
    );
  },

  _aboutTrendingPageIconPress: function() {
    AlertIOS.alert(
      'What is this?',
      "Youni’s Trending pages feature the top and up-and-coming people at your university in real time!" +
      "Daily Trending users have the highest scores for only that day. Weekly Trending users have the" +
      "highest scores for only that week.  All Time Trending users have the highest scores overall at your university. " +
      "To allow more users to be featured, the top 10 All Time Trending users won’t be featured in Daily or Weekly Trending.",
      [
        {text: 'Okay'}
      ]
    )
  },

  _changeFeedSelector: function(feed) {
    if (!trendingStore.isRequestInFlight() && feed !== this.state.selectedFeed) {
      this.setState({
        selectedFeed: feed
      });
      this._requestTrendingUsers(feed);
    }
  },

  _requestTrendingUsers: function(feed) {
    if (feed === this.currentFeed) {
      Unicycle.exec('getCurrentTrendingUsers');
    }
    else if (feed === this.weeklyFeed) {
      Unicycle.exec('getTrendingUsers');
    }
    else if (feed === this.allTimeFeed) {
      Unicycle.exec('getAllTimeTrendingUsers');
    }
  },

  _getTrendingUsers: function(feed) {
    if (feed === this.currentFeed) {
      return trendingStore.getCurrentTrendingUsers();
    }
    else if (feed === this.weeklyFeed) {
      return trendingStore.getWeeklyTrendingUsers();
    }
    else if (feed === this.allTimeFeed) {
      return trendingStore.getAllTimeTrendingUsers();
    }
  },

  _onErrorPageReload: function() {
    this._requestTrendingUsers(this.state.selectedFeed);
  }

});

module.exports = TrendingPage;
