'use strict';

var React = require('react-native');
var LoginSignupFlow = require('./Components/LoginSignupFlow/LoginSignupFlow');

var {
  View,
  StatusBar,
  StyleSheet,
  AppRegistry,
  NavigatorIOS
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

var RootNavigator = React.createClass({

  render: function() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="white"
          barStyle="light-content"/>
        <NavigatorIOS
          style={styles.container}
          navigationBarHidden={true}
          initialRoute={{
            title: '', // React Native as of 0.18.0 throws a warning if this isn't specified
            component: LoginSignupFlow
          }}/>
      </View>
    );
  }

});

AppRegistry.registerComponent('Youni', () => RootNavigator);
