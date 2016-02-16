'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var EditSettingsPage = require('../Profile/Settings/EditSettingsPage');
var OverlayPage = require('../Common/OverlayPage');
var editProfileInformationStore = require('../../stores/profile/EditProfileInformationStore');

var {
  View
} = React;

var EditProfilePopup = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

  mixins: [
    Unicycle.listenTo(editProfileInformationStore)
  ],

  render: function () {
    if (editProfileInformationStore.isVisible()) {
      return (
        <OverlayPage
          content={<EditSettingsPage navigator={this.props.navigator}/>}
          onBackArrowPress={() => {editProfileInformationStore.setVisibility(false);}}
          bannerTitle='Edit'/>
      );
    }
    else {
      return (
        <View/>
      );
    }
  }

});

module.exports = EditProfilePopup;
