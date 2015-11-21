'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');

var {
  View,
  TouchableHighlight,
  StyleSheet
} = React

var styles = StyleSheet.create({
  settingIconContainer: {
    position: 'absolute',
    top: 3,
    right: 10
  }
});

var EditSettingsButton = React.createClass({

  render: function() {
    return (
      <TouchableHighlight
        style={styles.settingIconContainer}
        underlayColor='transparent'>

        <Icon name='gear-a' size={40} color={'gray'} />

      </TouchableHighlight>
    );
  },

  _onSettingsButtonClick: function() {
    return;
  }

});

module.exports = EditSettingsButton;
