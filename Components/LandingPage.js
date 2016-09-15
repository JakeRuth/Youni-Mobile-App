'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Unicycle = require('../Unicycle');

var BaseAppSwiper = require('./BaseAppSwiper');
var HomePage = require('./HomePage');
var SearchPage = require('./Search/SearchPage');
var TrendingPage = require('./Trending/TrendingPage');
var WelcomeUserInfoPrompts = require('./WelcomePages/WelcomeUserInfoPrompts');

var notificationStore = require('../stores/NotificationStore');
var searchStore = require('../stores/SearchStore');
var userLoginMetadataStore = require('../stores/UserLoginMetadataStore');
var trendingStore = require('../stores/trending/TrendingStore');
var exploreFeedOrgsStore = require('../stores/group/ExploreFeedOrgsStore');

var Color = require('../Utils/Common/Colors');
var NotificationUtils = require('../Utils/Notification/NotificationUtils');

var {
  StyleSheet,
  AsyncStorage,
  AppStateIOS,
  PushNotificationIOS
} = ReactNative;

var styles = StyleSheet.create({
  tabBarContainer: {
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
      currentAppState: AppStateIOS.currentState
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

    AppStateIOS.addEventListener('change', this._handleAppStateChange);

    notificationStore.countUnreadNotifications();
    this._pollForNotifications();
  },

  componentWillUnmount: function() {
    AppStateIOS.removeEventListener('change', this._handleAppStateChange);
  },

  render: function() {
    if (userLoginMetadataStore.getShowInitialInfoPrompts()) {
      return <WelcomeUserInfoPrompts {...this.props}/>;
    }
    else {
      return (
        <BaseAppSwiper>
          <TrendingPage {...this.props}/>
          <SearchPage {...this.props}/>
          <HomePage {...this.props}/>
        </BaseAppSwiper>
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
      trendingStore.requestFeedForCurrentSelection();
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
