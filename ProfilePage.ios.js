'use strict';

var React = require('react-native');
var Unicycle = require('./Unicycle');
var profileOwnerStore = require('./stores/profile/ProfileOwnerStore');
var userLoginMetadataStore = require('./stores/UserLoginMetadataStore');
var MainScreenBanner = require('./MainScreenBanner');
var ProfilePageBody = require('./Components/Profile/ProfilePageBody');
var UserPosts = require('./Components/Profile/UserPosts');
var LogoutButton = require('./Components/Common/LogoutButton');
var ErrorPage = require('./Components/Common/ErrorPage');
var EditSettingsButton = require('./Components/Profile/Settings/EditSettingsButton');
var Spinner = require('./Components/Common/Spinner');

var {
  View,
  ScrollView,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  profilePageContainer: {
    flex: 1
  }
});

var ProfilePage = React.createClass({

  propTypes: {
    email: React.PropTypes.string.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  mixins: [
    Unicycle.listenTo(profileOwnerStore)
  ],

  componentDidMount: function() {
    Unicycle.exec('loadOwnerUsersProfile', this.props.email);
    this._requestProfilePosts();
  },

  render: function() {
    var isRequestInFlight = profileOwnerStore.isRequestInFlight(),
        anyErrorsLoadingPage = profileOwnerStore.anyErrorsLoadingPage(),
        content;

    if (anyErrorsLoadingPage) {
      content = <ErrorPage reloadButtonAction={this._onErrorPageReload}/>;
    }
    else if (isRequestInFlight) {
      content = (
        <Spinner/>
      );
    }
    else {
      content = (
        <ScrollView>

          <ProfilePageBody
            navigator={this.props.navigator}
            viewerIsProfileOwner={true}
            user={profileOwnerStore.getUserJson()}/>

          <UserPosts
            posts={profileOwnerStore.getPosts()}
            profileStore={profileOwnerStore}
            onLoadMorePostsPress={this._requestProfilePosts}
            noMorePostsToFetch={profileOwnerStore.getNoMorePostsToFetch()}
            viewerIsProfileOwner={true}
            loading={profileOwnerStore.isUserPostsRequestInFlight()}
            isNextPageLoading={profileOwnerStore.isLoadMorePostsRequestInFlight()}
            navigator={this.props.navigator}/>

        </ScrollView>
      );
    }

    return (
      <View style={styles.profilePageContainer}>

        <MainScreenBanner
          title={profileOwnerStore.getFirstName() + ' ' + profileOwnerStore.getLastName()}/>

        <LogoutButton navigator={this.props.navigator}/>
        <EditSettingsButton navigator={this.props.navigator}/>

        {content}

      </View>
    );
  },

  _requestProfilePosts: function() {
    var userId = userLoginMetadataStore.getUserId(),
        email = userLoginMetadataStore.getEmail();
    Unicycle.exec('getOwnerUserPosts', email, userId);
  },

  _onErrorPageReload: function() {
    Unicycle.exec('loadOwnerUsersProfile', this.props.email);
  }

});

module.exports = ProfilePage;
