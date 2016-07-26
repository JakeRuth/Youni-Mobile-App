'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');

var TrendingPageFilter = require('./TrendingPageFilter');
var TrendingUsersList = require('./TrendingUsersList');
var TrendingDropdownTrigger = require('./TrendingDropdownTrigger');
var TrendingFeedTypeDropdown = require('./TrendingFeedTypeDropdown');
var YouniHeader = require('../Common/YouniHeader');
var ErrorPage = require('../Common/ErrorPage');

var trendingStore = require('../../stores/trending/TrendingStore');
var TrendingFeedFilters = require('../../Utils/Enums/TrendingFeedFilters');

var {
  View,
  StyleSheet,
  AlertIOS,
  Dimensions
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  dropdownContainer: {
    position: 'absolute',
    top: 65,
    // centered horizontally. 185 should be the width of the dropdown
    left: (Dimensions.get('window').width - 185) / 2
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
      showDropdown: false
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

        <YouniHeader>
          <TrendingDropdownTrigger
            selectedType={trendingStore.getSelectedType()}
            onPress={this._toggleDropdownVisibility}
            isDropdownVisible={this.state.showDropdown}/>
        </YouniHeader>

        {errorPage}

        <TrendingUsersList
          users={this._getTrendingUsers(trendingStore.getSelectedFilter())}
          isPageLoading={trendingStore.isRequestInFlight()}
          onPageRefresh={() => { this._requestTrendingUsers(trendingStore.getSelectedFilter()) }}
          navigator={this.props.navigator}/>
        <TrendingPageFilter
          selectedFeed={trendingStore.getSelectedFilter()}
          currentFeed={TrendingFeedFilters.DAILY}
          weeklyFeed={TrendingFeedFilters.WEEKLY}
          allTimeFeed={TrendingFeedFilters.ALL_TIME}
          changeFeedSelector={(feed) => { this._changeFeedSelector(feed) }}/>

        {this._renderDropdown()}

      </View>
    );
  },
  
  _renderDropdown: function() {
    if (this.state.showDropdown) {
      return (
        <TrendingFeedTypeDropdown
          style={styles.dropdownContainer}
          onPress={() => this.setState({ showDropdown: false })}/>
      );
    }
  },

  _changeFeedSelector: function(feed) {
    if (!trendingStore.isRequestInFlight() && feed !== trendingStore.getSelectedFilter()) {
      trendingStore.setSelectedFilter(feed);
      this._requestTrendingUsers(feed);
    }
  },

  _toggleDropdownVisibility: function() {
    var currentState = this.state.showDropdown;

    this.setState({
      showDropdown: !currentState
    });
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
    this._requestTrendingUsers(trendingStore.getSelectedFilter());
  }

});

module.exports = TrendingPage;
