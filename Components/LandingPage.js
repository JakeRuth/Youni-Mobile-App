'use strict';

var React = require('react-native');
var Unicycle = require('../Unicycle');
var Icon = require('react-native-vector-icons/Ionicons');

var HomePage = require('./HomePage');
var SearchPage = require('./Search/SearchPage');
var ProfilePage = require('../ProfilePage');
var TrendingPage = require('./Trending/TrendingPage');
var CreatePostPage = require('../CreatePostPage');
var OverlayPage = require('./Common/OverlayPage');
var NotificationCallout = require('./Common/NotificationCallout');

var userLoginMetadataStore = require('../stores/UserLoginMetadataStore');
var tabStateStore = require('../stores/TabStateStore');
var notificationStore = require('../stores/NotificationStore');
var searchStore = require('../stores/SearchStore');

var Color = require('../Utils/Common/Colors');
var NotificationUtils = require('../Utils/Notification/NotificationUtils');

var {
  View,
  Text,
  StyleSheet,
  TabBarIOS,
  AsyncStorage,
  AppStateIOS,
  PushNotificationIOS
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

  getInitialState: function() {
    return {
      currentAppState: AppStateIOS.currentState
    };
  },

  componentWillMount: function() {
    PushNotificationIOS.addEventListener('register', this._onNotificationRegistration);
  },

  mixins: [
    Unicycle.listenTo(tabStateStore),
    Unicycle.listenTo(notificationStore)
  ],

  componentDidMount: function() {
    PushNotificationIOS.checkPermissions(function(permissions) {
      if (!permissions.badge && !permissions.alert && !permissions.sound) {
        PushNotificationIOS.requestPermissions();
      }
    });

    AppStateIOS.addEventListener('change', this._handleAppStateChange);

    notificationStore.countUnreadNotifications();
    this._pollForNotifications();

    //nice little trick to get the spinner to stay during the animation to home page
    AsyncStorage.getItem('accessToken').then(() => {
      Unicycle.exec('setSelectedTab', this.HOME_TAB);
    }).done();
  },

  componentWillUnmount: function() {
    AppStateIOS.removeEventListener('change', this._handleAppStateChange);
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
              searchStore.setInExploreFeedView(true);
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
        <ProfilePage navigator={this.props.navigator}/>
      </Icon.TabBarItem>
    );
  },

  _onNotificationRegistration: function(deviceToken) {
    NotificationUtils.createNotificationEndpointForUser(deviceToken);
  },

  _pollForNotifications: function() {
    var that = this;

    setInterval(function() {
      if (that.state.currentAppState === 'active') {
        notificationStore.countUnreadNotifications();
      }
    }, 60000); // every minute
  },

  _handleAppStateChange: function(currentAppState) {
    this.setState({
      currentAppState: currentAppState
    });
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
