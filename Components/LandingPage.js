'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Unicycle = require('../Unicycle');

var BaseAppSwiper = require('./BaseAppSwiper');
var BaseNavBar = require('./BaseNavBar');
var HomePage = require('./HomePage');
var SearchPage = require('./Search/SearchPage');
var CampusChallengePage = require('./CampusChallenge/CampusChallengePage');
var ProfileOwnerPage = require('./Profile/ProfileOwnerPage');
var WelcomeUserInfoPrompts = require('./WelcomePages/WelcomeUserInfoPrompts');

var notificationStore = require('../stores/NotificationStore');
var searchStore = require('../stores/SearchStore');
var userLoginMetadataStore = require('../stores/UserLoginMetadataStore');
var exploreFeedOrgsStore = require('../stores/group/ExploreFeedOrgsStore');

var NotificationUtils = require('../Utils/Notification/NotificationUtils');

var {
  View,
  StyleSheet,
  AsyncStorage,
  AppState,
  PushNotificationIOS
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

var LandingPage = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

  mixins: [
    Unicycle.listenTo(notificationStore),
    Unicycle.listenTo(userLoginMetadataStore)
  ],

  getInitialState: function() {
    return {
      currentAppState: AppState.currentState
    };
  },

  componentWillMount: function() {
    PushNotificationIOS.addEventListener('register', this._onNotificationRegistration);
  },

  componentDidMount: function() {
    PushNotificationIOS.checkPermissions(function(permissions) {
      if (!permissions.badge && !permissions.alert && !permissions.sound) {
        PushNotificationIOS.requestPermissions();
      }
    });

    AppState.addEventListener('change', this._handleAppStateChange);

    notificationStore.countUnreadNotifications();
    this._pollForNotifications();
  },

  componentWillUnmount: function() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  },

  render: function() {
    if (userLoginMetadataStore.getShowInitialInfoPrompts()) {
      return (
        <View style={styles.container}>
          <WelcomeUserInfoPrompts {...this.props}/>
        </View>
      );
    }
    else {
      return (
        <View style={styles.container}>
          <BaseAppSwiper>
            <HomePage {...this.props}/>
            <SearchPage {...this.props}/>
            <CampusChallengePage {...this.props}/>
            <ProfileOwnerPage
              {...this.props}
              hideBackButton={true}/>
          </BaseAppSwiper>
          <BaseNavBar {...this.props}/>
        </View>
      );
    }
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
    if (currentAppState === 'active') {
      console.log('refreshing');
      let userId = userLoginMetadataStore.getUserId();
      exploreFeedOrgsStore.requestTenMostRecentOrgs();
      Unicycle.exec('refreshExploreFeed', userId, true);
      Unicycle.exec('refreshHomeFeedData');
      Unicycle.exec('requestHomeFeed', userId);
    }
    
    this.setState({
      currentAppState: currentAppState
    });
  }

});

module.exports = LandingPage;
