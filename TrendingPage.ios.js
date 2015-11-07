'use strict';

var React = require('react-native');
var Unicycle = require('./Unicycle');
var trendingStore = require('./stores/TrendingStore');
var MainScreenBanner = require('./MainScreenBanner');

var {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image
} = React

var styles = StyleSheet.create({
  trendingPageContainer: {
    flex: 1
  },
  comingSoonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

var TrendingPage = React.createClass({

  render: function() {
    return (
      <View style={styles.trendingPageContainer}>
        <MainScreenBanner
          title='SUNY Albany'
          subTitle='Students trending on campus'/>

        <View style={styles.comingSoonContainer}>
          <Text>Coming soon!</Text>
        </View>

      </View>
    );
  }

});

module.exports = TrendingPage;
