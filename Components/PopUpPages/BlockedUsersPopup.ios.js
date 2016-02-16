'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var BlockedUsersPage = require('../Profile/Settings/BlockedUsersPage');
var OverlayPage = require('../Common/OverlayPage');
var editProfileInformationStore = require('../../stores/profile/EditProfileInformationStore');
var userLoginMetaDataStore = require('../../stores/UserLoginMetadataStore');

var BlockedUsersPopup = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

  mixins: [
    Unicycle.listenTo(editProfileInformationStore)
  ],

  componentDidMount() {
    var that = this,
        userEmail = userLoginMetaDataStore.getEmail();

    editProfileInformationStore.requestBlockedUsers(userEmail);
  },

  render: function () {
    var isContentLoading = (
      editProfileInformationStore.isGetBlockedUsersRequestInFlight() ||
      editProfileInformationStore.isRemoveBlockRequestInFlight()
    );
    var pageContent = (
      <BlockedUsersPage
        loading={isContentLoading}
        users={editProfileInformationStore.getBlockedUsers()}/>
    );

    return (
      <OverlayPage
        content={pageContent}
        onBackArrowPress={() => {this.props.navigator.pop();}}
        bannerTitle='Blocked'/>
    );
  }

});

module.exports = BlockedUsersPopup;
