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
    top: 30,
    width: 75,
    marginLeft: 10,
    backgroundColor: '#FF7878'
  },
  logoutText: {
    fontSize: 20,
    padding: 5,
    paddingTop: 2
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
    this.props.navigator.pop();
  }

});

module.exports = LogoutButton;
