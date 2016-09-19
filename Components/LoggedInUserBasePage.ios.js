'use strict';

var React = require('react');
var ReactNative = require('react-native');

var YouniNavigator = require('./Common/YouniNavigator');
var LandingPage = require('./LandingPage');
var ProfileOwnerPage = require('./Profile/ProfileOwnerPage');

var AppNavigationState = require('../Utils/Enums/AppNavigationState');

var {
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

var LoggedInUserBasePage = React.createClass({

  render: function() {
    return (
      <YouniNavigator
        initialRoute={AppNavigationState.INITIAL_ROUTE}
        renderScene={this._renderScene}/>
    );
  },

  _renderScene: function(route, navigator) {
    let routeJson;

    // for some reason when the app first loads and this function gets the initial route, the route is some sort of map...?
    if (!route.id) {
      routeJson = route.toJSON();
    }
    else {
      routeJson = route;
    }

    switch (routeJson.id) {
      case AppNavigationState.INITIAL_ROUTE.id:
        return <LandingPage navigator={navigator}/>;
      
      case AppNavigationState.PROFILE_OWNER_ROUTE.id:
        return <ProfileOwnerPage navigator={navigator}/>;

      default:
        return <View/>;
    }
  }

});

module.exports = LoggedInUserBasePage;
