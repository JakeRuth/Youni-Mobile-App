'use strict';

var React = require('react');
var ReactNative = require('react-native');

var YouniNavigator = require('./Common/YouniNavigator');
var LoginSignupFlow = require('./LoginSignupFlow/LoginSignupFlow');
var ForgotPasswordPage = require('./LoginSignupFlow/ForgotPasswordPage');
var EULAAgreementPage = require('./LoginSignupFlow/EULAAgreementPage');

var LoginSignupNavigationState = require('../Utils/Enums/LoginSignupNavigationState');

var {
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

var LoggedOutUserBasePage = React.createClass({

  render: function() {
    return (
      <YouniNavigator
        initialRoute={LoginSignupNavigationState.INITIAL_ROUTE}
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
      case LoginSignupNavigationState.INITIAL_ROUTE.id:
        return <LoginSignupFlow navigator={navigator}/>;
      
      case LoginSignupNavigationState.FORGOT_PASSWORD_ROUTE.id:
        return <ForgotPasswordPage navigator={navigator}/>;
      
      case LoginSignupNavigationState.AGREE_TO_TERMS_ROUTE.id:
        return <EULAAgreementPage navigator={navigator}/>;

      default:
        return <View/>;
    }
  }

});

module.exports = LoggedOutUserBasePage;
