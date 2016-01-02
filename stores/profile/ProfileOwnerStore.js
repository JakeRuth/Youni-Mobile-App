'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var postStore = require('../post/HomePostsStore');//TODO: FixME
var immutable = require('immutable');
var request = require('superagent');
var prefix = require('superagent-prefix')('http://greedyapi.elasticbeanstalk.com');
var PostUtils = require('../../Utils/Post/PostUtils');
var ProfileUtils = require('../../Utils/Profile/ProfileUtils');

var INITIAL_PAGE_OFFSET = 0;
var MAX_POSTS_PER_PAGE = 10;

var profileOwnerStore = Unicycle.createStore({

    init: function () {
      //TODO: Figure out why we can't call `this._setInitialState()` here...
      this.set({
        inSettingsView: false,
        isRequestInFlight: false,
        isUserPostsRequestInFlight: false,
        isLoadMorePostsRequestInFlight: false,
        isLikeRequestInFlight: false,
        isProfileOwnerFeedRefreshing: false,
        noMorePostsToFetch: false,
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

    $reInitProfilePageState: function() {
      this._setInitialState();
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

    $loadOwnerUsersProfile(email) {
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

    $getOwnerUserPosts(userEmail, userId) {
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

      ProfileUtils.getUserPostsAjax(
        {
          userEmail: userEmail,
          requestingUserIdString: userId,
          maxNumberOfPostsToFetch: MAX_POSTS_PER_PAGE,
          fetchOffsetAmount: offset
        },
        (res) => {
          var postsArray = postStore.createPostsJsonFromResponse(res.body.posts, offset),
              newPosts = immutable.List(postsArray),
              allPosts = that.getPosts().concat(newPosts);
          that.set({
            posts: allPosts,
            feedPageOffset: offset + MAX_POSTS_PER_PAGE,
            isUserPostsRequestInFlight: false,
            isLoadMorePostsRequestInFlight: false,
            noMorePostsToFetch: !res.body.moreResults
          });
        },
        () => {
          that.set({
            isUserPostsRequestInFlight: false,
            isLoadMorePostsRequestInFlight: false
          });
        }
      );
    },

    $refreshProfileOwnerPosts: function(userEmail, userId) {
      var that = this,
          originalOffset = this.getFeedPageOffset();

      this.set({
        isProfileOwnerFeedRefreshing: true
      });

      ProfileUtils.getUserPostsAjax(
        {
          userEmail: userEmail,
          requestingUserIdString: userId,
          maxNumberOfPostsToFetch: MAX_POSTS_PER_PAGE,
          fetchOffsetAmount: 0
        },
        (res) => {
          var postsArray = postStore.createPostsJsonFromResponse(res.body.posts, 0),
              newPosts = immutable.List(postsArray),
              currentPosts = this.getPosts(),
              allPosts = PostUtils.compressNewestPostsIntoCurrentPosts(newPosts, currentPosts);

          if (allPosts) {
            var numPostsAdded = allPosts.size - currentPosts.size,
                newOffset = originalOffset + numPostsAdded;

            that.set({
              posts: allPosts,
              feedPageOffset: newOffset,
              isProfileOwnerFeedRefreshing: false
            });
          }
          else {
            that.set({
              noMorePostsToFetch: false,
              posts: newPosts,
              isProfileOwnerFeedRefreshing: false,
              feedPageOffset: newPosts.size
            });
          }
        },
        () => {
          that.set({
            isProfileOwnerFeedRefreshing: false
          });
        }
      );
    },

    $likePostFromOwnerProfilePage(id, postId, userId) {
      var that = this;
      var posts = this.get('posts');

      this.set({
        isLikeRequestInFlight: true
      });

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
         that.set({
           isLikeRequestInFlight: false
         });
      });
    },

    $removeLikeProfileOwner(id, postId, userId) {
      var posts = this.get('posts'),
          that = this;

      this.set({
        isLikeRequestInFlight: true
      });

      PostUtils.removePostAjax(
        {
          postIdString: postId,
          userIdString: userId
        },
        () => {
          var post = posts.get(id);
          post.numLikes--;
          post.liked = false;
          posts = posts.set(id, post);
          that.set({
            posts: posts,
            isLikeRequestInFlight: false
          });
        },
        () => {
          that.set({
            isLikeRequestInFlight: false
          });
        }
      );
    },

    updateLikeCountForPost: function(id) {
      var posts = this.getPosts(),
          post = posts.get(id);
      post.numLikes++;
      post.liked = true;
      posts = posts.set(id, post);
      this.set({
        posts: posts
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

    isLikeRequestInFlight: function() {
      return this.get('isLikeRequestInFlight');
    },

    isFeedRefreshing: function() {
      return this.get('isProfileOwnerFeedRefreshing');
    },

    getNoMorePostsToFetch: function() {
      return this.get('noMorePostsToFetch');
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
      posts = posts.delete(id);
      posts = this._resetPostsJson(posts);
      this.set({
        posts: posts
      });
    },

    //TODO: Put this method and methods like createPostsJsonFromResponse in a utlitity class
    _resetPostsJson: function(posts) {
      var postsJson = [];

      for (var i = 0; i < posts.size; i++) {
        var post = posts.get(i);
        postsJson.push({
          posterProfileImageUrl: post.posterProfileImageUrl,
          postIdString: post.postIdString,
          posterName: post.posterName,
          timestamp: post.timestamp,
          photoUrl: post.photoUrl,
          numLikes: post.numLikes,
          caption: post.caption,
          liked: post.liked,
          id: i
        });
      }
      return immutable.List(postsJson);
    },

    _setInitialState: function() {
      this.set({
        inSettingsView: false,
        isRequestInFlight: false,
        isUserPostsRequestInFlight: false,
        isLoadMorePostsRequestInFlight: false,
        isLikeRequestInFlight: false,
        noMorePostsToFetch: false,
        firstName: '',
        lastName: '',
        numFollowers: null,
        bio: '',
        profileImageUrl: '',
        email: '',
        posts: [],
        feedPageOffset: INITIAL_PAGE_OFFSET
      });
    }

});

module.exports = profileOwnerStore;
