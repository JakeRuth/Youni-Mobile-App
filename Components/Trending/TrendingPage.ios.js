'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var trendingStore = require('../../stores/trending/TrendingStore');
var MainScreenBanner = require('../../MainScreenBanner');
var TrendingUsersGrid = require('./TrendingUsersGrid');
var ProfilePageBody = require('../Profile/ProfilePageBody');
var BackButton = require('../Common/BackButtonBar');

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
        content;

    if (isRequestInFlight) {
      content = this._renderLoadingSpinner();
    }
    else {
      content = <TrendingUsersGrid/>;
    }

    return (
      <View style={styles.trendingPageContainer}>
        <MainScreenBanner
          title='SUNY Albany'
          subTitle='Top Trending Students On Campus!'/>
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
  }

});

module.exports = TrendingPage;
