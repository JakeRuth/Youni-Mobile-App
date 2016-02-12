'use strict';

var React = require('react-native');
var Unicycle = require('../../../Unicycle');
var RemoveBlockedUsersButton = require('./RemoveBlockedUsersButton');
var EditBioBox = require('./EditBioBox');
var EditFirstNameBox = require('./EditFirstNameBox');
var EditLastNameBox = require('./EditLastNameBox');
var profileOwnerStore = require('../../../stores/profile/ProfileOwnerStore');

var {
  View
} = React;

var EditSettingsPage = React.createClass({

  mixins: [
    Unicycle.listenTo(profileOwnerStore)
  ],

  render: function() {
    return (
      <View>
        <EditBioBox/>
        <EditFirstNameBox/>
        <EditLastNameBox/>
        <RemoveBlockedUsersButton/>
      </View>
    );
  }

});

module.exports = EditSettingsPage;
