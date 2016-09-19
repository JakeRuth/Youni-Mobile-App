'use strict';

var React = require('react');
var ReactNative = require('react-native');

var YouniNavigator = require('./Common/YouniNavigator');

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
        initialRoute={{ component: require('./LoginSignupFlow/LoginSignupFlow') }}
        renderScene={(route, navigator) => React.createElement(route.component, { navigator, ...route.passProps })}/>
    );
  }

});

module.exports = LoggedOutUserBasePage;
