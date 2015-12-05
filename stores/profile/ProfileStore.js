'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var postStore = require('../PostStore');
var immutable = require('immutable');
var request = require('superagent');
var prefix = require('superagent-prefix')('http://greedyapi.elasticbeanstalk.com');

var INITIAL_PAGE_OFFSET = 0;
var MAX_POSTS_PER_PAGE = 10;

var profileStore = Unicycle.createStore({

    init: function () {
      this.set({
        inSettingsView: false,
        isRequestInFlight: false,
        isUserPostsRequestInFlight: false,
        isLoadMorePostsRequestInFlight: false,
        firstName: '',
        lastName: '',
        numFollowers: null,
        bio: '',
        profileImageUrl: '',
        email: '',
        posts: [],
        feedPageOffset: INITIAL_PAGE_OFFSET
      });
    },

    $setInSettingsView: function(inSettingsView) {
      this.set({
        inSettingsView: inSettingsView
      });
    },

    $setBio: function(bio) {
      this.set({
        bio: bio
      });
    },

    $setFirstName: function(firstName) {
      this.set({
        firstName: firstName
      });
    },

    $setLastName: function(lastName) {
      this.set({
        lastName: lastName
      });
    },

    $setProfileImageUrl: function(url) {
      this.set({
        profileImageUrl: url
      });
    },

    $loadUsersProfile(email) {
      var that = this;

      this.set({ isRequestInFlight: true });
      request
       .post('/user/getProfileInformation')
       .use(prefix)
       .send({ userEmail: email })
       .set('Accept', 'application/json')
       .end(function(err, res) {
         if ((res !== undefined) && (res.ok)) {
           that.set({
             isRequestInFlight: false,
             firstName: res.body.userDetails['firstName'],
             lastName: res.body.userDetails['lastName'],
             numFollowers: res.body.userDetails['numFollowers'],
             bio: res.body.userDetails['bio'],
             email: res.body.userDetails['email'],
             profileImageUrl: res.body.userDetails['profileImageUrl']
           });
         } else {
           //TODO: Implement a failed case
         }
       });
    },

    $deletePost(id, postId, userId) {
      //optimistically remove post from list, then call api to delete
      this._removePost(id);

      request
       .post('/post/delete')
       .use(prefix)
       .send({
         postIdString: postId,
         userIdString: userId
       })
       .set('Accept', 'application/json')
       .end(function(err, res) {
         if ((res !== undefined) && (res.ok)) {
           //TODO: Maybe we should give them some feedback?
         } else {
           //TODO: Implement a failed case
         }
       });
    },

    $getUserPosts(userEmail, userId) {
      var that = this,
          offset = this.getFeedPageOffset();

      if (offset == INITIAL_PAGE_OFFSET) {
        this.set({
          isUserPostsRequestInFlight: true,
          posts: []
        });
      }
      else {
        this.set({
          isLoadMorePostsRequestInFlight: true
        });
      }

      request
       .post('/user/getPosts')
       .use(prefix)
       .send({
         userEmail: userEmail,
         requestingUserIdString: userId,
         maxNumberOfPostsToFetch: MAX_POSTS_PER_PAGE,
         fetchOffsetAmount: offset
       })
       .set('Accept', 'application/json')
       .end(function(err, res) {
         if ((res !== undefined) && (res.ok)) {
           var postsArray = postStore.createPostsJsonFromResponse(res.body.posts, offset);
           var newPosts = immutable.List(postsArray);
           var allPosts = that.getPosts().concat(newPosts);
           that.set({
             posts: allPosts,
             feedPageOffset: offset + MAX_POSTS_PER_PAGE,
             isUserPostsRequestInFlight: false,
             isLoadMorePostsRequestInFlight: false
           });
         }
         else {
           //TODO: implement failed case (show user error message or cached results)
         }
      });
    },

    $likePostFromProfilePage(id, postId, userId) {
      var that = this;
      var posts = this.get('posts');

      request
       .post('/post/like')
       .use(prefix)
       .send({
         postIdString: postId,
         userIdString: userId
       })
       .set('Accept', 'application/json')
       .end(function(err, res) {
         if ((res !== undefined) && (res.ok) && (res.body.success)) {
           that.updateLikeCountForPost(id)
         }
         else {
           //TODO: implement failed case (show user error message or cached results)
         }
      });
    },

    $reInitializeUsersProfileFeedOffset: function() {
      this.set({
        feedPageOffset: INITIAL_PAGE_OFFSET,
        posts: []
      });
    },

    updateLikeCountForPost: function(id) {
      var posts = this.getPosts();
      var post = posts.get(id);
      var numLikes = post.get('numLikes');
      post = post.set('numLikes', ++numLikes);
      post = post.set('liked', true);
      this.set({
        posts: posts.set(id, post)
      });
    },

    isRequestInFlight() {
      return this.get('isRequestInFlight');
    },

    isUserPostsRequestInFlight: function() {
      return this.get('isUserPostsRequestInFlight');
    },

    isLoadMorePostsRequestInFlight: function() {
      return this.get('isLoadMorePostsRequestInFlight');
    },

    getInSettingsView: function() {
      return this.get('inSettingsView');
    },

    getFirstName: function() {
      return this.get('firstName');
    },

    getLastName: function() {
      return this.get('lastName');
    },

    getNumFollowers: function() {
      return this.get('numFollowers');
    },

    getBio: function() {
      return this.get('bio');
    },

    getProfileImageUrl: function() {
      return this.get('profileImageUrl');
    },

    getEmail: function() {
      return this.get('email');
    },

    getPosts: function() {
      return this.get('posts');
    },

    getFeedPageOffset: function() {
      return this.get('feedPageOffset');
    },

    _removePost: function(id) {
      var posts = this.getPosts();
      this.set({
        posts: posts.delete(id)
      });
    }

});

module.exports = profileStore;
