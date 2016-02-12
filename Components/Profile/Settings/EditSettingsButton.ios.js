'use strict';

var React = require('react-native');
var Unicycle = require('../../../Unicycle');
var Icon = require('react-native-vector-icons/Ionicons');
var editProfileInformationStore = require('../../../stores/profile/EditProfileInformationStore');

var {
  View,
  TouchableHighlight,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  settingIconContainer: {
    position: 'absolute',
    top: 21,
    right: 10,
    padding: 5
  }
});

var EditSettingsButton = React.createClass({

  render: function() {
    return (
      <TouchableHighlight
        onPress={this._onSettingsButtonClick}
        style={styles.settingIconContainer}
        underlayColor='transparent'>

        <Icon name='edit' size={20} color={'white'} />

      </TouchableHighlight>
    );
  },

  _onSettingsButtonClick: function() {
    editProfileInformationStore.setVisibility(true);
  }

});

module.exports = EditSettingsButton;
