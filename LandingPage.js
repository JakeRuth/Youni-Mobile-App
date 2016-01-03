'use strict'

var React = require('react-native');
var HomePage = require('./HomePage');
var SearchPage = require('./SearchPage');
var ProfilePage = require('./ProfilePage');
var TrendingPage = require('./Components/Trending/TrendingPage');
var CreatePostPage = require('./CreatePostPage');
var ProfileModal = require('./Components/Profile/ProfileModal');
var BlockedUsersModal = require('./Components/Profile/Settings/BlockedUsersModal');
var Icon = require('react-native-vector-icons/Ionicons');
var loginStore = require('./stores/LoginStore');
var userLoginMetadataStore = require('./stores/UserLoginMetadataStore');
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
    Unicycle.listenTo(loginStore)
  ],

  componentDidMount: function() {
    //nice little trick to get the spinner to stay during the animation to home page
    AsyncStorage.getItem('accessToken').then(() => {
      this.setState({'selectedTab': 'home'});
      Unicycle.exec('setLoginInFlight', false);
    }).done();
  },

  getInitialState: function() {
    return {
      selectedTab: ''
    };
  },

  render: function() {
    return (
      <View style={styles.tabBarContainer}>
        <ProfileModal/>
        <BlockedUsersModal/>

        <TabBarIOS
          tintColor="#007C9E">
          <Icon.TabBarItem
            title="Home"
            iconName="ios-home-outline"
            selectedIconName="ios-home-outline"
            selected={this.state.selectedTab === 'home'}
            onPress={() => {
              this.setState({
                selectedTab: 'home',
              });
            }}>
            <HomePage/>
          </Icon.TabBarItem>
          <Icon.TabBarItem
            title="Explore"
            iconName="ios-search"
            selectedIconName="ios-search"
            selected={this.state.selectedTab === 'search'}
            onPress={() => {
              Unicycle.exec('setInProfileView', false);
              Unicycle.exec('setInExploreFeedView', true);
              this.setState({
                selectedTab: 'search',
              });
            }}>
            <SearchPage/>
          </Icon.TabBarItem>
          <Icon.TabBarItem
            title="Take Photo"
            iconName="ios-camera-outline"
            selectedIconName="ios-camera-outline"
            selected={this.state.selectedTab === 'takePhoto'}
            onPress={() => {
              Unicycle.exec('setAnyErrorsOnCreatePostPage', false);
              this.setState({
                selectedTab: 'takePhoto',
              });
            }}>
            <CreatePostPage/>
          </Icon.TabBarItem>
          <Icon.TabBarItem
            title="Trending"
            iconName="fireball"
            selectedIconName="fireball"
            selected={this.state.selectedTab === 'trend'}
            onPress={() => {
              this.setState({
                selectedTab: 'trend'
              });
            }}>
            <TrendingPage/>
          </Icon.TabBarItem>
          <Icon.TabBarItem
            title="Profile"
            iconName="ios-people-outline"
            selectedIconName="ios-people-outline"
            selected={this.state.selectedTab === 'profile'}
            onPress={() => {
              this.setState({
                selectedTab: 'profile'
              });
            }}>
            <ProfilePage
              email={userLoginMetadataStore.getEmail()}
              navigator={this.props.navigator} />
          </Icon.TabBarItem>
        </TabBarIOS>
      </View>
    );
  }

});

module.exports = LandingPage;
