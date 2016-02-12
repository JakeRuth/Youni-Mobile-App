'use strict';

var React = require('react-native');
var Unicycle = require('../../../Unicycle');
var userLoginMetadataStore = require('../../../stores/UserLoginMetadataStore');

var {
  TouchableHighlight,
  Text,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  showBlockedUsersButton: {
    margin: 10
  },
  buttonLabel: {
    fontSize: 20,
    textAlign: 'center'
  }
});

var RemoveBlockedUsersButton = React.createClass({

  render: function() {
    return (
      <TouchableHighlight
        style={styles.showBlockedUsersButton}
        underlayColor='transparent'
        onPress={this._onButtonPress}>

        <Text style={styles.buttonLabel}>Show Blocked Users</Text>

      </TouchableHighlight>
    );
  },

  _onButtonPress: function() {
    var email = userLoginMetadataStore.getEmail();
    Unicycle.exec('getBlockedUsers', email);
  }

});

module.exports = RemoveBlockedUsersButton;
