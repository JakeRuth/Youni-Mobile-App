'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var EditSettingsPage = require('../Profile/Settings/EditSettingsPage');
var OverlayPage = require('../Common/OverlayPage');
var editProfileInformationStore = require('../../stores/profile/EditProfileInformationStore');

var EditProfilePopup = React.createClass({

  propTypes: {
    user: React.PropTypes.object.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  mixins: [
    Unicycle.listenTo(editProfileInformationStore)
  ],

  render: function () {
    var content = (
      <EditSettingsPage {...this.props}/>
    );
    
    return (
      <OverlayPage
        content={content}
        onBackArrowPress={() => {this.props.navigator.pop();}}
        bannerTitle='Edit Profile'
        showLogoutButton={true}
        navigator={this.props.navigator}/>
    );
  }

});

module.exports = EditProfilePopup;
