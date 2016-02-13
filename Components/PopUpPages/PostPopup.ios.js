'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var Post = require('../Post/Post');
var OverlayPage = require('../Common/OverlayPage');
var explorePostsStore = require('../../stores/post/ExplorePostsStore');

var {
    View
} = React;

var PostPopup = React.createClass({

    mixins: [
        Unicycle.listenTo(explorePostsStore)
    ],

    render: function() {
        var selectedPost = explorePostsStore.getSelectedPost();

        if (selectedPost) {
            return (
                <OverlayPage
                    content={this._renderPost(selectedPost)}
                    onBackArrowPress={() => {explorePostsStore.setSelectedPostId(null);}}/>
            );
        }
        else {
            return (
                <View/>
            );
        }
    },

    _renderPost: function(selectedPost) {
        return (
            <Post
                postStore={explorePostsStore}
                post={selectedPost}/>
        );
    }

});

module.exports = PostPopup;
