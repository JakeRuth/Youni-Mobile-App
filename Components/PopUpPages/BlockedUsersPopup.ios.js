'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var BlockedUsersPage = require('../Profile/Settings/BlockedUsersPage');
var OverlayPage = require('../Common/OverlayPage');
var editProfileInformationStore = require('../../stores/profile/EditProfileInformationStore');

var {
    View
} = React;

var BlockedUsersPopup = React.createClass({

    mixins: [
        Unicycle.listenTo(editProfileInformationStore)
    ],

    render: function() {
        if (editProfileInformationStore.isBlockedPageVisible()) {
            return (
                <OverlayPage
                    content={<BlockedUsersPage/>}
                    onBackArrowPress={() => {editProfileInformationStore.setBlockedPageVisibility(false);}}
                    bannerTitle='Blocked'/>
            );
        }
        else {
            return (
                <View/>
            );
        }
    }

});

module.exports = BlockedUsersPopup;
