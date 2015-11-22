'use strict';

var React = require('react-native');
var Unicycle = require('../../../Unicycle');
var Icon = require('react-native-vector-icons/Ionicons');

var {
  View,
  TouchableHighlight,
  StyleSheet
} = React

var styles = StyleSheet.create({
  settingIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10
  }
});

var EditSettingsButton = React.createClass({

  render: function() {
    return (
      <TouchableHighlight
        onPress={this._onSettingsButtonClick}
        style={styles.settingIconContainer}
        underlayColor='transparent'>

        <Icon name='edit' size={35} color={'gray'} />

      </TouchableHighlight>
    );
  },

  _onSettingsButtonClick: function() {
    Unicycle.exec('setInSettingsView', true);
  }

});

module.exports = EditSettingsButton;
