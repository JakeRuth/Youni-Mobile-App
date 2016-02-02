'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var globalAppPageStateStore = require('../../stores/GlobalAppPageStateStore');
var PAGE_KEYS = require('../../Utils/Enums/PageNameEnum');

var {
  TouchableHighlight,
  Text,
  StyleSheet,
  AsyncStorage
} = React

var styles = StyleSheet.create({
  logoutButtonContainer: {
    position: 'absolute',
    top: 25,
    width: 75,
    marginLeft: 10
  },
  logoutText: {
    fontSize: 17,
    padding: 5,
    paddingTop: 2,
    color: 'white'
  }
});

var LogoutButton = React.createClass({

  render: function() {
    return (
      <TouchableHighlight
        style={styles.logoutButtonContainer}
        underlayColor='transparent'
        onPress={this._onLogoutButtonPress}>

        <Text style={styles.logoutText}>Logout</Text>

      </TouchableHighlight>
    );
  },

  _onLogoutButtonPress: function() {
    AsyncStorage.removeItem('password');
    Unicycle.exec('refreshHomeFeedData');
    Unicycle.exec('refreshExploreFeedData');
    Unicycle.exec('reInitProfilePageState');
    globalAppPageStateStore.setCurrentPage(PAGE_KEYS.loginPage);
  }

});

module.exports = LogoutButton;
