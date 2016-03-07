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

var loginStore = require('./stores/LoginStore');
var userLoginMetadataStore = require('./stores/UserLoginMetadataStore');
var tabStateStore = require('./stores/TabStateStore');

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

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

  mixins: [
    Unicycle.listenTo(loginStore),
    Unicycle.listenTo(tabStateStore)
  ],

  componentDidMount: function() {
    //nice little trick to get the spinner to stay during the animation to home page
    AsyncStorage.getItem('accessToken').then(() => {
      Unicycle.exec('setSelectedTab', 'home');
      Unicycle.exec('setLoginInFlight', false);
    }).done();
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
        tintColor="#5d6aff">

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
        selected={tabStateStore.getSelectedTab() === 'home'}
        onPress={() => {
              this._transitionState('home');
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
        selected={tabStateStore.getSelectedTab() === 'search'}
        onPress={() => {
              Unicycle.exec('setInExploreFeedView', true);
              this._transitionState('search');
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
        selected={tabStateStore.getSelectedTab() === 'takePhoto'}
        onPress={() => {
              Unicycle.exec('setAnyErrorsOnCreatePostPage', false);
              Unicycle.exec('setShouldShowImagePickerForPost', true);
              this._transitionState('takePhoto');
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
        selected={tabStateStore.getSelectedTab() === 'trend'}
        onPress={() => {
              this._transitionState('trend');
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
        selected={tabStateStore.getSelectedTab() === 'profile'}
        onPress={() => {
              this._transitionState('profile');
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
  }

});

module.exports = LandingPage;
