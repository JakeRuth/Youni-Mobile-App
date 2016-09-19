'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Unicycle = require('./Unicycle');

var LoggedInUserBasePage = require('./Components/LoggedInUserBasePage');
var LoggedOutUserBasePage = require('./Components/LoggedOutUserBasePage');

var userLoginStatusStore = require('./stores/common/UserLoginStatusStore');

var {
  View,
  StatusBar,
  StyleSheet,
  AppRegistry
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

var RootNavigator = React.createClass({

  mixins: [
    Unicycle.listenTo(userLoginStatusStore)
  ],

  render: function() {
    var content;

    if (userLoginStatusStore.isLoggedIn()) {
      content = <LoggedInUserBasePage/>;
    }
    else {
      content = <LoggedOutUserBasePage/>;
    }

    return (
      <View style={styles.container}>
        <StatusBar barStyle='light-content'/>
        {content}
      </View>
    );
  }

});

AppRegistry.registerComponent('Youni', () => RootNavigator);
