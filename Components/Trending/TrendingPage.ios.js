'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var trendingStore = require('../../stores/trending/TrendingStore');
var MainScreenBanner = require('../../MainScreenBanner');
var TrendingUsersList = require('./TrendingUsersList');
var BackButton = require('../Common/BackButtonBar');
var ErrorPage = require('../Common/ErrorPage');

var {
  View,
  Text,
  StyleSheet,
  ActivityIndicatorIOS
} = React;

var styles = StyleSheet.create({
  trendingPageContainer: {
    flex: 1
  },
  pageHeaderText: {
    textAlign: 'center',
    color: '#525252',
    fontSize: 18,
    padding: 5
  },
  contentSeparator: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#525252',
    marginLeft: 45,
    marginRight: 45
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
      content = <TrendingUsersList/>;
    }

    return (
      <View style={styles.trendingPageContainer}>

        <MainScreenBanner title='Trending'/>
        <Text style={styles.pageHeaderText}>
          Top Trending Users This Week!
        </Text>
        <View style={styles.contentSeparator}/>
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
