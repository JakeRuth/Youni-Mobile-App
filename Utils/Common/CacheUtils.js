'use strict';

var ReactNative = require('react-native');
var Unicycle = require('../../Unicycle');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var {
    AsyncStorage
} = ReactNative;

var CacheUtils = {

    HOME_FEED_POSTS_KEY: 'homeFeedPosts',

    loadHomeFeed: function() {
        var userId = userLoginMetadataStore.getUserId(),
            postsJson;

        AsyncStorage.getItem(this.HOME_FEED_POSTS_KEY).then((homeFeedPostsString) => {
            if (homeFeedPostsString) {
                postsJson = JSON.parse(homeFeedPostsString);
                Unicycle.exec('setHomeFeedPosts', postsJson);
                Unicycle.exec('refreshHomeFeed', userId);
            }
            else {
                Unicycle.exec('requestHomeFeed', userId);
            }
        }).done();
    },

    saveHomeFeedPosts: function(postsJson) {
        if (postsJson) {
            AsyncStorage.setItem(this.HOME_FEED_POSTS_KEY, JSON.stringify(postsJson));
        }
    }

};

module.exports = CacheUtils;
