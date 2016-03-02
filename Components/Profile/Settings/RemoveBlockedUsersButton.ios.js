'use strict';

var React = require('react-native');
var BlockedUsersPopup = require('../../PopUpPages/BlockedUsersPopup');

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

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

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
    this.props.navigator.push({
      component: BlockedUsersPopup
    });
  }

});

module.exports = RemoveBlockedUsersButton;
