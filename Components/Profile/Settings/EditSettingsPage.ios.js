'use strict';

var React = require('react-native');
var Unicycle = require('../../../Unicycle');
var BackButtonBar = require('../../Common/BackButtonBar');
var RemoveBlockedUsersButton = require('./RemoveBlockedUsersButton');
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

});

var EditSettingsPage = React.createClass({

  mixins: [
    Unicycle.listenTo(editProfileInformationStore)
  ],

  render: function() {
    return (
      <View>
        <BackButtonBar buttonOnPress={this._onBackButtonPress}/>
        <EditBioBox/>
        <EditFirstNameBox/>
        <EditLastNameBox/>
        <RemoveBlockedUsersButton/>
      </View>
    );
  },

  _onBackButtonPress: function() {
    Unicycle.exec('setInSettingsView', false);
  }

});

module.exports = EditSettingsPage;
