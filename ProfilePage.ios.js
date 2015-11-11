'use strict';

var React = require('react-native');
var Unicycle = require('./Unicycle');
var profileStore = require('./stores/ProfileStore');
var MainScreenBanner = require('./MainScreenBanner');
var ProfilePageBody = require('./Components/Profile/ProfilePageBody');

var {
  View,
  StyleSheet,
  ActivityIndicatorIOS
} = React

var styles = StyleSheet.create({
  profilePageContainer: {
    flex: 1
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

//This is a super raw page, it is likely going to be completely re-written when
//we finalize a new design
var ProfilePage = React.createClass({

  mixins: [
    Unicycle.listenTo(profileStore)
  ],

  render: function() {
    var isRequestInFlight = profileStore.isRequestInFlight();
    var content;

    if (isRequestInFlight) {
      content = <ProfilePageLoading/>
    }
    else {
      content = <ProfilePageBody
                  viewerIsProfileOwner = {true}
                  firstName = {profileStore.getFirstName()}
                  lastName = {profileStore.getLastName()}
                  bio = {profileStore.getBio()}
                  numFans = {profileStore.getNumFollowers()}
                  profileImageUrl = {profileStore.getProfileImageUrl()}
                />;
    }

    return (
      <View style={styles.profilePageContainer}>
        <MainScreenBanner
          title="My Profile"
          subTitle="Hey look, its you!"/>
        { content }
      </View>
    );
  }

});

var ProfilePageLoading = React.createClass({

  render: function() {
    return (
      <View style={styles.spinnerContainer}>
        <ActivityIndicatorIOS
          size="small"
          color="black"
          animating={true}
          style={styles.spinner} />
      </View>
    );
  }

});

module.exports = ProfilePage;
