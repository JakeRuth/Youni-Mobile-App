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
    top: 0,
    right: 0,
    paddingTop: 22,
    paddingRight: 12,
    paddingLeft: 15,
    paddingBottom: 15
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
