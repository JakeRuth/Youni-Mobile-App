'use strict';

var React = require('react-native');
var Unicycle = require('./Unicycle');
var profileOwnerStore = require('./stores/profile/ProfileOwnerStore');
var getAllFollowingStore = require('./stores/user/GetAllFollowingStore');
var userLoginMetadataStore = require('./stores/UserLoginMetadataStore');
var EditSettingsPage = require('./Components/Profile/Settings/EditSettingsPage');
var GetAllFollowingPage = require('./Components/Profile/GetAllFollowingPage');
var MainScreenBanner = require('./MainScreenBanner');
var ProfilePageBody = require('./Components/Profile/ProfilePageBody');
var LogoutButton = require('./Components/Common/LogoutButton');
var ErrorPage = require('./Components/Common/ErrorPage');
var EditSettingsButton = require('./Components/Profile/Settings/EditSettingsButton');

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
        inFollowingView = getAllFollowingStore.getIsInView(),
        anyErrorsLoadingPage = profileOwnerStore.anyErrorsLoadingPage(),
        content;

    if (anyErrorsLoadingPage) {
      content = <ErrorPage reloadButtonAction={this._onErrorPageReload}/>;
    }
    else if (inSettingsView) {
      content = <EditSettingsPage/>;
    }
    else if (isRequestInFlight) {
      content = this._renderLoadingSpinner();
    }
    else if (inFollowingView) {
      content = <GetAllFollowingPage/>;
    }
    else {
      content = <ProfilePageBody
                  viewerIsProfileOwner={true}
                  firstName={profileOwnerStore.getFirstName()}
                  lastName={profileOwnerStore.getLastName()}
                  bio={profileOwnerStore.getBio()}
                  numFans={profileOwnerStore.getNumFollowers()}
                  numPosts={profileOwnerStore.getNumPosts()}
                  totalPoints={profileOwnerStore.getTotalPoints()}
                  profileImageUrl={profileOwnerStore.getProfileImageUrl()}
                  email={this.props.email}
                  navigator={this.props.navigator} />;
    }

    return (
      <View style={styles.profilePageContainer}>

        <MainScreenBanner
          title={profileOwnerStore.getFirstName() + ' ' + profileOwnerStore.getLastName()}/>

        <LogoutButton navigator={this.props.navigator}/>
        <EditSettingsButton/>

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
          animating={true}/>
      </View>
    );
  },

  _onErrorPageReload: function() {
    var email = userLoginMetadataStore.getEmail();
    Unicycle.exec('loadOwnerUsersProfile', email);
  }

});

module.exports = ProfilePage;
