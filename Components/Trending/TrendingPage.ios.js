'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var trendingStore = require('../../stores/trending/TrendingStore');
var MainScreenBanner = require('../../MainScreenBanner');
var TrendingUsersGrid = require('./TrendingUsersGrid');
var BackButton = require('../Common/BackButtonBar');
var ErrorPage = require('../Common/ErrorPage');

var {
  View,
  StyleSheet,
  ActivityIndicatorIOS
} = React

var styles = StyleSheet.create({
  trendingPageContainer: {
    flex: 1
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

var TrendingPage = React.createClass({

  mixins: [
    Unicycle.listenTo(trendingStore)
  ],

  componentDidMount: function() {
    Unicycle.exec('getTrendingUsers');
  },

  render: function() {
    var isRequestInFlight = trendingStore.isRequestInFlight(),
        anyErrorsLoadingPage = trendingStore.anyErrorsLoadingPage(),
        content;

    if (isRequestInFlight) {
      content = this._renderLoadingSpinner();
    }
    else if (anyErrorsLoadingPage) {
      content = <ErrorPage reloadButtonAction={this._onErrorPageReload}/>
    }
    else {
      content = <TrendingUsersGrid/>;
    }

    return (
      <View style={styles.trendingPageContainer}>
        <MainScreenBanner title='Trending'/>
        {content}
      </View>
    );
  },

  _renderLoadingSpinner: function() {
    return (
      <View style={styles.spinnerContainer}>
        <ActivityIndicatorIOS
          size="small"
          color="black"
          animating={true} />
      </View>
    );
  },

  _onErrorPageReload: function() {
    Unicycle.exec('getTrendingUsers');
  }

});

module.exports = TrendingPage;
