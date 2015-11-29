'use strict';

var React = require('react-native');
var Unicycle = require('./../Unicycle');
var postStore = require('./PostStore');
var request = require('superagent');
var prefix = require('superagent-prefix')('http://greedyapi.elasticbeanstalk.com');

var profileStore = Unicycle.createStore({

    init: function () {
      this.set({
        inSettingsView: false,
        isRequestInFlight: false,
        isUploadBioRequestInFlight: false,
        isUploadFirstNameRequestInFlight: false,
        isUploadLastNameRequestInFlight: false,
        isUserPostsRequestInFlight: false,
        firstName: '',
        lastName: '',
        numFollowers: null,
        bio: '',
        profileImageUrl: '',
        email: '',
        posts: []
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

    $uploadUserBio: function(userId, bio) {
      var that = this;

      this.set({ isUploadBioRequestInFlight: true });
      request
       .post('/user/updateBio')
       .use(prefix)
       .send({
         userIdString: userId,
         bio: bio
        })
       .set('Accept', 'application/json')
       .end(function(err, res) {
         if ((res !== undefined) && (res.ok)) {
           //no feedback required, view was already optimistically updated
         } else {
           //TODO: Implement a failed case
         }
         that.set({
           isUploadBioRequestInFlight: false
         });
       });
    },

    $uploadUserFirstName: function(userId, firstName) {
      var that = this;

      this.set({ isUploadFirstNameRequestInFlight: true });
      request
       .post('/user/updateFirstName')
       .use(prefix)
       .send({
         userIdString: userId,
         firstName: firstName
        })
       .set('Accept', 'application/json')
       .end(function(err, res) {
         if ((res !== undefined) && (res.ok)) {
           //no feedback required, view was already optimistically updated
         } else {
           //TODO: Implement a failed case
         }
         that.set({
           isUploadFirstNameRequestInFlight: false
         });
       });
    },

    $uploadUserLastName: function(userId, lastName) {
      var that = this;

      this.set({ isUploadLastNameRequestInFlight: true });
      request
       .post('/user/updateFirstName')
       .use(prefix)
       .send({
         userIdString: userId,
         lastName: lastName
        })
       .set('Accept', 'application/json')
       .end(function(err, res) {
         if ((res !== undefined) && (res.ok)) {
           //no feedback required, view was already optimistically updated
         } else {
           //TODO: Implement a failed case
         }
         that.set({
           isUploadLastNameRequestInFlight: false
         });
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

    $getUserPosts(userEmail) {
      var posts = [];
      var that = this;

      this.set({
        isUserPostsRequestInFlight: true
      });

      request
       .post('/user/getPosts')
       .use(prefix)
       .send({
         userEmail: userEmail,
         maxNumberOfPostsToFetch: 10, //TODO: enable paged results
         fetchOffsetAmount: 0
       })
       .set('Accept', 'application/json')
       .end(function(err, res) {
         if ((res !== undefined) && (res.ok)) {
           console.log(res.body)
           posts = postStore.createPostsJsonFromResponse(res.body.posts);
           that.set({
             posts: posts,
             isUserPostsRequestInFlight: false
           });
         }
         else {
           //TODO: implement failed case (show user error message or cached results)
         }
      });
    },

    isRequestInFlight() {
      return this.get('isRequestInFlight');
    },

    isUploadBioRequestInFlight: function() {
      return this.get('isUploadBioRequestInFlight');
    },

    isUploadFirstNameRequestInFlight: function() {
      return this.get('isUploadFirstNameRequestInFlight');
    },

    isUploadLastNameRequestInFlight: function() {
      return this.get('isUploadLastNameRequestInFlight');
    },

    isUserPostsRequestInFlight: function() {
      return this.get('isUserPostsRequestInFlight');
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
    }

});

module.exports = profileStore;
