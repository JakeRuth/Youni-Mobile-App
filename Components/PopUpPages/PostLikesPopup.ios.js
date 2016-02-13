'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var PostLikesList = require('../Post/Footer/Like/PostLikesList');
var OverlayPage = require('../Common/OverlayPage');
var postLikePopupStore = require('../../stores/post/like/PostLikePopupStore');

var {
    View
} = React;

var PostLikesPopup = React.createClass({

    mixins: [
        Unicycle.listenTo(postLikePopupStore)
    ],

    render: function() {
        if (postLikePopupStore.isVisible()) {
            return (
                <OverlayPage
                    content={<PostLikesList/>}
                    onBackArrowPress={() => {postLikePopupStore.setVisibility(false);}}
                    bannerTitle='Likes'/>
            );
        }
        else {
            return (
                <View/>
            );
        }
    }

});

module.exports = PostLikesPopup;
