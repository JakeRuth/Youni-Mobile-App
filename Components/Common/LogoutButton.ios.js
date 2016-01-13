'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');

var {
  TouchableHighlight,
  Text,
  StyleSheet,
  AsyncStorage
} = React

var styles = StyleSheet.create({
  logoutButtonContainer: {
    position: 'absolute',
    top: 23,
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

  propTypes: {
    navigator: React.PropTypes.any.isRequired
  },

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
    this.props.navigator.pop();
  }

});

module.exports = LogoutButton;
