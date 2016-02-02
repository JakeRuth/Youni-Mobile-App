'use strict';

var React = require('react-native');
var Unicycle = require('./Unicycle');
var globalAppPageStateStore = require('./stores/GlobalAppPageStateStore');
var PAGE_KEYS = require('./Utils/Enums/PageNameEnum');
var LoginPage = require('./Components/LoginPage');
var LandingPage = require('./LandingPage');

var {
  View,
  StyleSheet,
  AppRegistry
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

var RootNavigator = React.createClass({

  mixins: [
    Unicycle.listenTo(globalAppPageStateStore)
  ],

  render: function() {
    var currentPage = globalAppPageStateStore.getCurrentPage();

    return (
      <View style={styles.container}>
        {this._renderCurrentPage(currentPage)}
      </View>
    );
  },

  _renderCurrentPage: function(currentPage) {
    if (PAGE_KEYS.loginPage == currentPage) {
      return <LoginPage/>;
    }
    else if (PAGE_KEYS.landingPage == currentPage) {
      return <LandingPage/>;
    }
    else {
      // TODO: Figure out what we really want to do for this case
      return <View/>;
    }
  }

});

AppRegistry.registerComponent('Youni', () => RootNavigator);
