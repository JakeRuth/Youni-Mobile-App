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
  trendingProfilesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    margin: 5
  },
  trendingProfileImage: {
    margin: 3,
    height: 85,
    width: 85,
    borderRadius: 2
  }
});

var TrendingPage = React.createClass({

  mixins: [
    Unicycle.listenTo(trendingStore)
  ],

  componentDidMount: function() {
    Unicycle.exec('populateTrendingProfiles');
  },

  render: function() {
    return (
      <View style={styles.trendingPageContainer}>
        <MainScreenBanner
          title="SUNY Albany"
          subTitle="Students who are trending on campus"/>
        {this.renderTrendingProfiles()}
      </View>
    );
  },

  renderTrendingProfiles: function() {
    var trendingProfilesJson = trendingStore.getTrendingProfiles();
    var profiles = [];
    for (var i = 0; i < trendingProfilesJson.size; i++) {
      var profile = trendingProfilesJson.get(i);
      var photoUrl = profile.get('profileImageUrl');
      profiles.push(
        <Image style={styles.trendingProfileImage}
               source={{uri: photoUrl}}
               key={i} />
      );
    }

    return (
      <ScrollView>
        <View style={styles.trendingProfilesContainer}>
          {profiles}
        </View>
      </ScrollView>
    );
  }

});

module.exports = TrendingPage;
