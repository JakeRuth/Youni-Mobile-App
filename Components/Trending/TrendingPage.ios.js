'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var trendingStore = require('../../stores/trending/TrendingStore');
var MainScreenBanner = require('../../MainScreenBanner');
var TrendingUsersList = require('./TrendingUsersList');
var ErrorPage = require('../Common/ErrorPage');
var TrendingPageSelector = require('./TrendingPageSelector');

var {
  View,
  Text,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 50
  }
});

var TrendingPage = React.createClass({

  currentFeed: 'Now',
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

      </View>
    );
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
