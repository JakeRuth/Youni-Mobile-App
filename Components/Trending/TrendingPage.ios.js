'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var trendingStore = require('../../stores/trending/TrendingStore');
var MainScreenBanner = require('../../MainScreenBanner');
var TrendingUsersList = require('./TrendingUsersList');
var BackButton = require('../Common/BackButtonBar');
var ErrorPage = require('../Common/ErrorPage');
var TrendingPageSelector = require('./TrendingPageSelector');

var {
  View,
  Text,
  StyleSheet,
  ActivityIndicatorIOS
} = React;

var styles = StyleSheet.create({
  trendingPageContainer: {
    flex: 1,
    marginBottom: 50
  },
  spinnerContainer: {
    marginTop: 10
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

    return (
      <View style={styles.trendingPageContainer}>

        <MainScreenBanner title='Trending'/>
        <TrendingPageSelector disabled={trendingStore.isRequestInFlight()}/>

        {content}

        <TrendingUsersList navigator={this.props.navigator}/>

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
