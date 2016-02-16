'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var EditSettingsPage = require('../Profile/Settings/EditSettingsPage');
var OverlayPage = require('../Common/OverlayPage');
var editProfileInformationStore = require('../../stores/profile/EditProfileInformationStore');

var EditProfilePopup = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

  mixins: [
    Unicycle.listenTo(editProfileInformationStore)
  ],

  render: function () {
    return (
      <OverlayPage
        content={<EditSettingsPage navigator={this.props.navigator}/>}
        onBackArrowPress={() => {this.props.navigator.pop();}}
        bannerTitle='Edit'/>
    );
  }

});

module.exports = EditProfilePopup;
