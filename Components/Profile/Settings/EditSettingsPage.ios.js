'use strict';

var React = require('react-native');
var Unicycle = require('../../../Unicycle');
var BackButtonBar = require('../../Common/BackButtonBar');
var EditBioBox = require('./EditBioBox');

var {
  View,
  Text,
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

var EditSettingsPage = React.createClass({

  render: function() {
    return (
      <View>
        <BackButtonBar buttonOnPress={this._onBackButtonPress}/>
        <EditBioBox />
      </View>
    );
  },

  _onBackButtonPress: function() {
    Unicycle.exec('setInSettingsView', false);
  }

});

module.exports = EditSettingsPage;
