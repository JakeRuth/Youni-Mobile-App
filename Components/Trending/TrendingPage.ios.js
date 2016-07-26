'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var Icon = require('react-native-vector-icons/Ionicons');
var trendingStore = require('../../stores/trending/TrendingStore');
var YouniHeader = require('../Common/YouniHeader');
var TrendingUsersList = require('./TrendingUsersList');
var ErrorPage = require('../Common/ErrorPage');
var TrendingPageFilter = require('./TrendingPageFilter');
var TrendingFeedFilters = require('../../Utils/Enums/TrendingFeedFilters');

var {
  View,
  Text,
  StyleSheet,
  AlertIOS
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  trendingIcon: {
    marginBottom: 2,
    marginRight: 3
  },
  headerText: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    color: 'white'
  }
});

var TrendingPage = React.createClass({

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
      selectedFeed: TrendingFeedFilters.DAILY
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

        <YouniHeader style={styles.header}>
          <Icon
            style={styles.trendingIcon}
            name='podium'
            size={25}
            color='white'/>
          <Text style={styles.headerText}>
            People
          </Text>
        </YouniHeader>

        {errorPage}

        <TrendingUsersList
          users={this._getTrendingUsers(this.state.selectedFeed)}
          isPageLoading={trendingStore.isRequestInFlight()}
          onPageRefresh={() => { this._requestTrendingUsers(this.state.selectedFeed) }}
          navigator={this.props.navigator}/>
        <TrendingPageFilter
          selectedFeed={this.state.selectedFeed}
          currentFeed={TrendingFeedFilters.DAILY}
          weeklyFeed={TrendingFeedFilters.WEEKLY}
          allTimeFeed={TrendingFeedFilters.ALL_TIME}
          changeFeedSelector={(feed) => { this._changeFeedSelector(feed) }}/>

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
    if (feed === TrendingFeedFilters.DAILY) {
      Unicycle.exec('getCurrentTrendingUsers');
    }
    else if (feed === TrendingFeedFilters.WEEKLY) {
      Unicycle.exec('getTrendingUsers');
    }
    else if (feed === TrendingFeedFilters.ALL_TIME) {
      Unicycle.exec('getAllTimeTrendingUsers');
    }
  },

  _getTrendingUsers: function(feed) {
    if (feed === TrendingFeedFilters.DAILY) {
      return trendingStore.getCurrentTrendingUsers();
    }
    else if (feed === TrendingFeedFilters.WEEKLY) {
      return trendingStore.getWeeklyTrendingUsers();
    }
    else if (feed === TrendingFeedFilters.ALL_TIME) {
      return trendingStore.getAllTimeTrendingUsers();
    }
  },

  _onErrorPageReload: function() {
    this._requestTrendingUsers(this.state.selectedFeed);
  }

});

module.exports = TrendingPage;
