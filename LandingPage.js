'use strict';

var React = require('react-native');
var HomePage = require('./Components/HomePage');
var SearchPage = require('./SearchPage');
var ProfilePage = require('./ProfilePage');
var TrendingPage = require('./Components/Trending/TrendingPage');
var CreatePostPage = require('./CreatePostPage');
var OverlayPage = require('./Components/Common/OverlayPage');
var PostPopup = require('./Components/PopupPages/PostPopup');
var PostLikesPopup = require('./Components/PopupPages/PostLikesPopup');
var UserFollowingListPopup = require('./Components/PopupPages/UserFollowingListPopup');
var EditSettingsPage = require('./Components/Profile/Settings/EditSettingsPage');
var ProfileModal = require('./Components/Profile/ProfileModal');
var BlockedUsersPage = require('./Components/Profile/Settings/BlockedUsersPage');
var PostCommentsModal = require('./Components/Post/PostCommentsModal');
var Icon = require('react-native-vector-icons/Ionicons');
var loginStore = require('./stores/LoginStore');
var userLoginMetadataStore = require('./stores/UserLoginMetadataStore');
var tabStateStore = require('./stores/TabStateStore');
var editProfileInformationStore = require('./stores/profile/EditProfileInformationStore');
var Unicycle = require('./Unicycle');

var {
  View,
  Text,
  StyleSheet,
  TabBarIOS,
  AsyncStorage
} = React;

var styles = StyleSheet.create({
  tabBarContainer: {
    flex: 1
  }
});

var LandingPage = React.createClass({

  mixins: [
    Unicycle.listenTo(loginStore),
    Unicycle.listenTo(tabStateStore),
    Unicycle.listenTo(editProfileInformationStore)
  ],

  componentDidMount: function() {
    //nice little trick to get the spinner to stay during the animation to home page
    AsyncStorage.getItem('accessToken').then(() => {
      Unicycle.exec('setSelectedTab', 'home');
      Unicycle.exec('setLoginInFlight', false);
    }).done();
  },

  render: function() {
    var editProfileInformationPopup = null,
        blockedUsersPopup = null;

    if (editProfileInformationStore.isVisible()) {
      editProfileInformationPopup = (
          <OverlayPage
              content={<EditSettingsPage/>}
              onBackArrowPress={() => {editProfileInformationStore.setVisibility(false);}}
              bannerTitle='Edit'/>
      );
    }

    if (editProfileInformationStore.isBlockedPageVisible()) {
      blockedUsersPopup = (
          <OverlayPage
              content={<BlockedUsersPage/>}
              onBackArrowPress={() => {editProfileInformationStore.setBlockedPageVisibility(false);}}
              bannerTitle='Blocked'/>
      );
    }

    return (
      <View style={styles.tabBarContainer}>
        <PostCommentsModal/>
        <ProfileModal/>

        <TabBarIOS
          tintColor="#0083D4">
          <Icon.TabBarItem
            title="Home"
            iconName="ios-home-outline"
            selectedIconName="ios-home-outline"
            selected={tabStateStore.getSelectedTab() === 'home'}
            onPress={() => {
              this._transitionState('home');
            }}>
            <HomePage/>
          </Icon.TabBarItem>
          <Icon.TabBarItem
            title="Explore"
            iconName="ios-search"
            selectedIconName="ios-search"
            selected={tabStateStore.getSelectedTab() === 'search'}
            onPress={() => {
              Unicycle.exec('setInProfileView', false);
              Unicycle.exec('setInExploreFeedView', true);
              this._transitionState('search');
            }}>
            <SearchPage/>
          </Icon.TabBarItem>
          <Icon.TabBarItem
            title="Take Photo"
            iconName="ios-camera-outline"
            selectedIconName="ios-camera-outline"
            selected={tabStateStore.getSelectedTab() === 'takePhoto'}
            onPress={() => {
              Unicycle.exec('setAnyErrorsOnCreatePostPage', false);
              Unicycle.exec('setShouldShowImagePickerForPost', true);
              this._transitionState('takePhoto');
            }}>
            <CreatePostPage previousTab={tabStateStore.getPreviousTab()}/>
          </Icon.TabBarItem>
          <Icon.TabBarItem
            title="Trending"
            iconName="fireball"
            selectedIconName="fireball"
            selected={tabStateStore.getSelectedTab() === 'trend'}
            onPress={() => {
              this._transitionState('trend');
            }}>
            <TrendingPage/>
          </Icon.TabBarItem>
          <Icon.TabBarItem
            title="Profile"
            iconName="ios-people-outline"
            selectedIconName="ios-people-outline"
            selected={tabStateStore.getSelectedTab() === 'profile'}
            onPress={() => {
              this._transitionState('profile');
            }}>
            <ProfilePage
              email={userLoginMetadataStore.getEmail()}/>
          </Icon.TabBarItem>
        </TabBarIOS>

        { /* The order here is very important! */ }
        <PostLikesPopup/>
        <PostPopup/>
        <UserFollowingListPopup/>
        {blockedUsersPopup}
        {editProfileInformationPopup}
      </View>
    );
  },

  _transitionState: function(selectedTabName) {
    var previousTabName = tabStateStore.getSelectedTab();
    Unicycle.exec('setPreviousTab', previousTabName);
    Unicycle.exec('setSelectedTab', selectedTabName);
  }

});

module.exports = LandingPage;
