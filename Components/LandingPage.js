'use strict';

var React = require('react-native');
var Unicycle = require('../Unicycle');
var Icon = require('react-native-vector-icons/Ionicons');

var HomePage = require('./HomePage');
var SearchPage = require('./Search/SearchPage');
var TrendingPage = require('./Trending/TrendingPage');

var tabStateStore = require('../stores/TabStateStore');
var notificationStore = require('../stores/NotificationStore');
var searchStore = require('../stores/SearchStore');

var ShowImagePicker = require('./CreatePost/ShowImagePicker');
var Color = require('../Utils/Common/Colors');
var NotificationUtils = require('../Utils/Notification/NotificationUtils');
var TabLabel = require('../Utils/Enums/TabLabel');

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
      tabStateStore.setSelectedTab(TabLabel.HOME);
    }).done();
  },

  componentWillUnmount: function() {
    AppStateIOS.removeEventListener('change', this._handleAppStateChange);
  },

  render: function() {
    return (
      <View style={styles.tabBarContainer}>
        {this._renderTabBar()}
      </View>
    );
  },

  _renderTabBar: function() {
    return (
      <TabBarIOS
        tintColor={Color.YOUNI_PRIMARY_PURPLE}>

        {this._renderExploreTab()}
        {this._renderTakePhotoTab()}
        {this._renderTrendingTab()}

      </TabBarIOS>
    );
  },

  _renderExploreTab: function() {
    return (
      <Icon.TabBarItem
        title="Explore"
        iconName="ios-search"
        selectedIconName="ios-search"
        selected={tabStateStore.getSelectedTab() === TabLabel.EXPLORE}
        onPress={() => {
          searchStore.setInExploreFeedView(true);
          tabStateStore.setSelectedTab(TabLabel.EXPLORE);
        }}>
        <SearchPage navigator={this.props.navigator}/>
      </Icon.TabBarItem>
    );
  },

  _renderTakePhotoTab: function() {
    var selectedTab = tabStateStore.getSelectedTab(),
        tabLabel,
        iconName;

    if (selectedTab === TabLabel.HOME) {
      tabLabel = "Take Photo";
      iconName = "android-home";
    }
    else {
      tabLabel = "Home";
      iconName = "ios-camera-outline";
    }
    
    return (
      <Icon.TabBarItem
        title={tabLabel}
        iconName={iconName}
        selectedIconName={iconName}
        selected={selectedTab === TabLabel.HOME}
        onPress={() => {
          if (selectedTab === TabLabel.HOME) {
            ShowImagePicker.showImagePicker(this.props.navigator);
          }
          else {
            tabStateStore.setSelectedTab(TabLabel.HOME);
          }
        }}>
        <HomePage {...this.props}/>
      </Icon.TabBarItem>
    );
  },

  _renderTrendingTab: function() {
    return (
      <Icon.TabBarItem
        title="Trending"
        iconName="fireball"
        selectedIconName="fireball"
        selected={tabStateStore.getSelectedTab() === TabLabel.TRENDING}
        onPress={() => {
          tabStateStore.setSelectedTab(TabLabel.TRENDING);
        }}>
        <TrendingPage navigator={this.props.navigator}/>
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
  }

});

module.exports = LandingPage;
