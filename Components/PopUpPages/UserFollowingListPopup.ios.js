'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var GetAllFollowingPage = require('../Profile/GetAllFollowingPage');
var OverlayPage = require('../Common/OverlayPage');
var getAllFollowingStore = require('../../stores/user/GetAllFollowingStore');

var {
    View
} = React;

var UserFollowingListPopup = React.createClass({

    mixins: [
        Unicycle.listenTo(getAllFollowingStore)
    ],

    render: function() {
        if (getAllFollowingStore.isVisible()) {
            return (
                <OverlayPage
                    content={<GetAllFollowingPage/>}
                    onBackArrowPress={() => {getAllFollowingStore.setVisibility(false);}}
                    bannerTitle='Following'/>
            );
        }
        else {
            return (
                <View/>
            );
        }
    }

});

module.exports = UserFollowingListPopup;
