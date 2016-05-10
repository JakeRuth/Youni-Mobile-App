'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');

var {
  TouchableHighlight,
  Text,
  StyleSheet,
  AsyncStorage,
  AlertIOS
} = React;

var styles = StyleSheet.create({
  logoutButtonContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 75,
    padding: 5,
    paddingTop: 15
  },
  logoutText: {
    fontSize: 17,
    padding: 5,
    color: 'white'
  }
});

var LogoutButton = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    return (
      <TouchableHighlight
        style={styles.logoutButtonContainer}
        underlayColor='transparent'
        onPress={this._onLogoutButtonPressAreYouSurePrompt}>

        <Text style={styles.logoutText}>Logout</Text>

      </TouchableHighlight>
    );
  },

  _onConfirmLogoutPress: function() {
    AsyncStorage.removeItem('password');
    Unicycle.exec('refreshHomeFeedData');
    Unicycle.exec('refreshExploreFeedData');
    Unicycle.exec('reInitProfilePageState');
    Unicycle.exec('updatePassword', '');
    Unicycle.exec('setShouldRenderLoginPage', true);
    this.props.navigator.popToTop();
  },

  _onLogoutButtonPressAreYouSurePrompt: function() {
    AlertIOS.alert(
      'Logout',
      'Are you sure you want Logout?',
      [
        {
          text: 'Yes',
          onPress: this._onConfirmLogoutPress
        },
        {
          text: 'No'
        }
      ]
    );
  }

});

module.exports = LogoutButton;
