'use strict';

var React = require('react-native');
var Unicycle = require('../../../Unicycle');
var userLoginMetadataStore = require('../../../stores/UserLoginMetadataStore');

var {
  TouchableHighlight,
  Text,
  StyleSheet
} = React

var styles = StyleSheet.create({
  showBlockedUsersButton: {
    borderWidth: 1,
    borderColor: 'black',
    margin: 10,
    backgroundColor: '#DBDBDB'
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
