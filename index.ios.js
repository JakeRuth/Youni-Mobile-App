'use strict';

var React = require('react-native');
var LoginPage = require('./Components/LoginPage');

var {
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
        <NavigatorIOS
          style={styles.container}
          navigationBarHidden={true}
          initialRoute={{
            title: '', // React Native as of 0.18.0 throws a warning if this isn't specified
            component: LoginPage
          }}/>
    );
  }

});

AppRegistry.registerComponent('Youni', () => RootNavigator);
