'use strict';

var React = require('react-native');
var Unicycle = require('../../../Unicycle');
var BackButtonBar = require('../../Common/BackButtonBar');
var EditBioBox = require('./EditBioBox');
var EditFirstNameBox = require('./EditFirstNameBox');
var EditLastNameBox = require('./EditLastNameBox');
var editProfileInformationStore = require('../../../stores/profile/EditProfileInformationStore');

var {
  View,
  Text,
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

  mixins: [
    Unicycle.listenTo(editProfileInformationStore)
  ],

  render: function() {
    return (
      <View>
        <BackButtonBar buttonOnPress={this._onBackButtonPress}/>
        <EditBioBox />
        <EditFirstNameBox />
        <EditLastNameBox />
      </View>
    );
  },

  _onBackButtonPress: function() {
    Unicycle.exec('setInSettingsView', false);
  }

});

module.exports = EditSettingsPage;
