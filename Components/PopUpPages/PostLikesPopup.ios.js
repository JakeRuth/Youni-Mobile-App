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

    propTypes: {
        likerUsers: React.PropTypes.array.isRequired
    },

    mixins: [
        Unicycle.listenTo(postLikePopupStore)
    ],

    render: function() {
        if (postLikePopupStore.isVisible()) {
            return (
                <OverlayPage
                    content={<PostLikesList likerUsers={this.props.likerUsers}/>}
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
