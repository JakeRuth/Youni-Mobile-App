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
  trendingPageContainer: {
    flex: 1,
    marginBottom: 50
  }
});

var TrendingPage = React.createClass({

  weeklyFeed: 'Weekly',
  allTimeFeed: 'All Time',

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

  mixins: [
    Unicycle.listenTo(trendingStore)
  ],

  componentDidMount: function() {
    Unicycle.exec('getTrendingUsers');
  },

  getInitialState: function() {
    return {
      selectedFeed: this.weeklyFeed
    };
  },

  render: function() {
    var isRequestInFlight = trendingStore.isRequestInFlight(),
        anyErrorsLoadingPage = trendingStore.anyErrorsLoadingPage(),
        content;

    if (anyErrorsLoadingPage) {
      content = <ErrorPage reloadButtonAction={this._onErrorPageReload}/>
    }

    return (
      <View style={styles.trendingPageContainer}>

        <MainScreenBanner title='Trending'/>
        <TrendingPageSelector
          selectedFeed={this.state.selectedFeed}
          weeklyFeed={this.weeklyFeed}
          allTimeFeed={this.allTimeFeed}
          changeFeedSelector={(feed) => { this._changeFeedSelector(feed) }}
          disabled={trendingStore.isRequestInFlight()}/>

        {content}

        <TrendingUsersList
          isPageRefreshing={trendingStore.isRequestInFlight()}
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
    if (feed === this.weeklyFeed) {
      Unicycle.exec('getTrendingUsers');
    }
    else if (feed === this.allTimeFeed) {
      Unicycle.exec('getAllTimeTrendingUsers');
    }
  },

  _onErrorPageReload: function() {
    Unicycle.exec('getTrendingUsers');
  }

});

module.exports = TrendingPage;
