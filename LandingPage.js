'use strict';

var React = require('react-native');
var Unicycle = require('./Unicycle');
var Icon = require('react-native-vector-icons/Ionicons');

var HomePage = require('./Components/HomePage');
var SearchPage = require('./SearchPage');
var ProfilePage = require('./ProfilePage');
var TrendingPage = require('./Components/Trending/TrendingPage');
var CreatePostPage = require('./CreatePostPage');
var OverlayPage = require('./Components/Common/OverlayPage');
var NotificationCallout = require('./Components/Common/NotificationCallout');

var loginStore = require('./stores/LoginStore');
var userLoginMetadataStore = require('./stores/UserLoginMetadataStore');
var tabStateStore = require('./stores/TabStateStore');
var notificationStore = require('./stores/NotificationStore');

var Color = require('./Utils/Common/GlobalColorMap');

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
  },
  notificationCalloutContainer: {
    position: 'absolute',
    bottom: 27,
    right: 12,
    backgroundColor: 'transparent'
  }
});

var LandingPage = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

  mixins: [
    Unicycle.listenTo(loginStore),
    Unicycle.listenTo(tabStateStore),
    Unicycle.listenTo(notificationStore)
  ],

  componentDidMount: function() {
    notificationStore.startPollingForUnread();

    //nice little trick to get the spinner to stay during the animation to home page
    AsyncStorage.getItem('accessToken').then(() => {
      Unicycle.exec('setSelectedTab', 'home');
      Unicycle.exec('setLoginInFlight', false);
    }).done();
  },

  render: function() {
    var numUnreadNotifications = notificationStore.getUnreadNotifications(),
        notificationCallout;

    if (numUnreadNotifications && tabStateStore.getSelectedTab() !== this.PROFILE_TAB) {
      notificationCallout = (
        <View style={styles.notificationCalloutContainer}>
          <NotificationCallout label={numUnreadNotifications}/>
        </View>
      );
    }

    return (
      <View style={styles.tabBarContainer}>
        {this._renderTabBar()}
        {notificationCallout}
      </View>
    );
  },

  _renderTabBar: function() {
    return (
      <TabBarIOS
        tintColor={Color.YOUNI_PRIMARY_PURPLE}>

        {this._renderHomeTab()}
        {this._renderExploreTab()}
        {this._renderTakePhotoTab()}
        {this._renderTrendingTab()}
        {this._renderProfileTab()}

      </TabBarIOS>
    );
  },

  _renderHomeTab: function() {
    return (
      <Icon.TabBarItem
        title="Home"
        iconName="ios-home-outline"
        selectedIconName="ios-home-outline"
        selected={tabStateStore.getSelectedTab() === this.HOME_TAB}
        onPress={() => {
              this._transitionState(this.HOME_TAB);
            }}>
        <HomePage navigator={this.props.navigator}/>
      </Icon.TabBarItem>
    );
  },

  _renderExploreTab: function() {
    return (
      <Icon.TabBarItem
        title="Explore"
        iconName="ios-search"
        selectedIconName="ios-search"
        selected={tabStateStore.getSelectedTab() === this.EXPLORE_TAB}
        onPress={() => {
              Unicycle.exec('setInExploreFeedView', true);
              this._transitionState(this.EXPLORE_TAB);
            }}>
        <SearchPage navigator={this.props.navigator}/>
      </Icon.TabBarItem>
    );
  },

  _renderTakePhotoTab: function() {
    return (
      <Icon.TabBarItem
        title="Take Photo"
        iconName="ios-camera-outline"
        selectedIconName="ios-camera-outline"
        selected={tabStateStore.getSelectedTab() === this.CREATE_POST_TAB}
        onPress={() => {
              Unicycle.exec('setAnyErrorsOnCreatePostPage', false);
              Unicycle.exec('setShouldShowImagePickerForPost', true);
              this._transitionState(this.CREATE_POST_TAB);
            }}>
        <CreatePostPage previousTab={tabStateStore.getPreviousTab()}/>
      </Icon.TabBarItem>
    );
  },

  _renderTrendingTab: function() {
    return (
      <Icon.TabBarItem
        title="Trending"
        iconName="fireball"
        selectedIconName="fireball"
        selected={tabStateStore.getSelectedTab() === this.TRENDING_TAB}
        onPress={() => {
              this._transitionState(this.TRENDING_TAB);
            }}>
        <TrendingPage navigator={this.props.navigator}/>
      </Icon.TabBarItem>
    );
  },

  _renderProfileTab: function() {
    return (
      <Icon.TabBarItem
        title="Profile"
        iconName="ios-people-outline"
        selectedIconName="ios-people-outline"
        selected={tabStateStore.getSelectedTab() === this.PROFILE_TAB}
        onPress={() => {
              this._transitionState(this.PROFILE_TAB);
            }}>
        <ProfilePage
          email={userLoginMetadataStore.getEmail()}
          navigator={this.props.navigator}/>
      </Icon.TabBarItem>
    );
  },

  _transitionState: function(selectedTabName) {
    var previousTabName = tabStateStore.getSelectedTab();
    Unicycle.exec('setPreviousTab', previousTabName);
    Unicycle.exec('setSelectedTab', selectedTabName);
  },

  HOME_TAB: 'home',
  EXPLORE_TAB: 'explore',
  CREATE_POST_TAB: 'createPost',
  TRENDING_TAB: 'trending',
  PROFILE_TAB: 'profile'

});

module.exports = LandingPage;
