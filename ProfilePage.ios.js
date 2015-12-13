'use strict';

var React = require('react-native');
var Unicycle = require('./Unicycle');
var profileOwnerStore = require('./stores/profile/ProfileOwnerStore');
var EditSettingsPage = require('./Components/Profile/Settings/EditSettingsPage');
var getAllFollowingStore = require('./stores/user/GetAllFollowingStore');
var GetAllFollowingPage = require('./Components/Profile/GetAllFollowingPage');
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

  propTypes: {
    email: React.PropTypes.string.isRequired,
    navigator: React.PropTypes.any.isRequired
  },

  mixins: [
    Unicycle.listenTo(profileOwnerStore),
    Unicycle.listenTo(getAllFollowingStore)
  ],

  componentDidMount: function() {
    if (profileOwnerStore.getPosts().size === 0) {
      Unicycle.exec('loadOwnerUsersProfile', this.props.email);
    }
  },

  render: function() {
    var isRequestInFlight = profileOwnerStore.isRequestInFlight(),
        inSettingsView = profileOwnerStore.getInSettingsView(),
        followingViewActive = getAllFollowingStore.getIsInView(),
        content;

    if (inSettingsView) {
      content = <EditSettingsPage/>
    }
    else if (isRequestInFlight) {
      content = <ProfilePageLoading/>
    }
    else if (followingViewActive) {
      content = <GetAllFollowingPage/>;
    }
    else {
      content = <ProfilePageBody
                  viewerIsProfileOwner={true}
                  firstName={profileOwnerStore.getFirstName()}
                  lastName={profileOwnerStore.getLastName()}
                  bio={profileOwnerStore.getBio()}
                  numFans={profileOwnerStore.getNumFollowers()}
                  profileImageUrl={profileOwnerStore.getProfileImageUrl()}
                  email={this.props.email}
                  navigator={this.props.navigator} />;
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
