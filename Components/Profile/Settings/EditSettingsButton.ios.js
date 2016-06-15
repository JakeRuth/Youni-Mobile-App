'use strict';

var React = require('react-native');
var Unicycle = require('../../../Unicycle');
var Icon = require('react-native-vector-icons/Ionicons');
var EditProfilePopup = require('../../PopupPages/EditProfilePopup');

var {
  View,
  TouchableHighlight,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  settingIconContainer: {
    position: 'absolute',
    top: 13,
    right: 5,
    padding: 5,
    paddingLeft: 20
  }
});

var EditSettingsButton = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    return (
      <TouchableHighlight
        onPress={this._onSettingsButtonClick}
        style={styles.settingIconContainer}
        underlayColor='transparent'>

        <Icon
          name='ios-gear-outline'
          size={25}
          color='white'/>

      </TouchableHighlight>
    );
  },

  _onSettingsButtonClick: function() {
    this.props.navigator.push({
      component: EditProfilePopup
    });
  }

});

module.exports = EditSettingsButton;
