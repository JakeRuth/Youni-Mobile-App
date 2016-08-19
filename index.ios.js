'use strict';

var React = require('react');
var ReactNative = require('react-native');
var DismissKeyboard = require('dismissKeyboard');
var Unicycle = require('./Unicycle');

var statusBarStyleStore = require('./stores/StatusBarStyleStore');
var LoginSignupFlow = require('./Components/LoginSignupFlow/LoginSignupFlow');

var {
  View,
  StatusBar,
  StyleSheet,
  AppRegistry,
  NavigatorIOS,
  TouchableWithoutFeedback
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

var RootNavigator = React.createClass({

  mixins: [
    Unicycle.listenTo(statusBarStyleStore)
  ],

  render: function() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle={statusBarStyleStore.getStyle()}/>

        <TouchableWithoutFeedback onPress={() => DismissKeyboard()}>
          <NavigatorIOS
            style={styles.container}
            navigationBarHidden={true}
            initialRoute={{
              title: '', // React Native as of 0.18.0 throws a warning if this isn't specified
              component: LoginSignupFlow
            }}/>
        </TouchableWithoutFeedback>
      </View>
    );
  }

});

AppRegistry.registerComponent('Youni', () => RootNavigator);
