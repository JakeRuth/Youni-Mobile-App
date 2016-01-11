'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var immutable = require('immutable');
var PostUtils = require('../../Utils/Post/PostUtils');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');

var INITIAL_PAGE_OFFSET = 0;
var MAX_POSTS_PER_PAGE = 10;

var profileStore = Unicycle.createStore({

    init: function () {
      this.set({
        isRequestInFlight: false,
        isUserPostsRequestInFlight: false,
        isLoadMorePostsRequestInFlight: false,
        isLikeRequestInFlight: false,
        noMorePostsToFetch: false,
        firstName: '',
        lastName: '',
        numFollowers: null,
        numPosts: null,
        bio: '',
        profileImageUrl: '',
        email: '',
        posts: [],
        feedPageOffset: INITIAL_PAGE_OFFSET
      });
    },

    $loadUsersProfile(email) {
      var that = this;

      this.set({
        isRequestInFlight: true
      });

      AjaxUtils.ajax(
        '/user/getProfileInformation',
        {
          userEmail: email
        },
        (res) => {
          that.set({
            isRequestInFlight: false,
            firstName: res.body.userDetails['firstName'],
            lastName: res.body.userDetails['lastName'],
            numFollowers: res.body.userDetails['numFollowers'],
            bio: res.body.userDetails['bio'],
            email: res.body.userDetails['email'],
            profileImageUrl: res.body.userDetails['profileImageUrl'],
            numPosts: res.body.userDetails['numPosts']
          });
        },
        () => {
          that.set({
            sRequestInFlight: false
          });
        }
      );
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

      AjaxUtils.ajax(
        '/user/getPosts',
        {
          userEmail: userEmail,
          requestingUserIdString: userId,
          maxNumberOfPostsToFetch: MAX_POSTS_PER_PAGE,
          fetchOffsetAmount: offset
        },
        (res) => {
          var postsArray = PostUtils.createPostsJsonFromGreedy(res.body.posts, offset);
          var newPosts = immutable.List(postsArray);
          var allPosts = that.getPosts().concat(newPosts);
          that.set({
            posts: allPosts,
            feedPageOffset: offset + MAX_POSTS_PER_PAGE,
            isUserPostsRequestInFlight: false,
            isLoadMorePostsRequestInFlight: false,
            noMorePostsToFetch: !res.body.moreResults
          });
        },
        () => {that.set({
          isUserPostsRequestInFlight: false,
          isLoadMorePostsRequestInFlight: false
        });
        }
      );
    },

    $likePostFromProfilePage(id, postId, userId) {
      var that = this,
          posts = this.get('posts');

      this.set({
        isLikeRequestInFlight: true
      });

      AjaxUtils.ajax(
        '/post/like',
        {
          postIdString: postId,
          userIdString: userId
        },
        (res) => {
          that.set({
            posts: PostUtils.increaseLikeCount(posts, id),
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

    $removeLikeProfile(id, postId, userId) {
      var posts = this.get('posts'),
          that = this;

      this.set({
        isLikeRequestInFlight: true
      });

      AjaxUtils.ajax(
        '/post/removeLike',
        {
          postIdString: postId,
          userIdString: userId
        },
        (res) => {
          that.set({
            posts: PostUtils.decreaseLikeCount(posts, id),
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

    $reInitializeUsersProfileFeedOffset: function() {
      this.set({
        feedPageOffset: INITIAL_PAGE_OFFSET,
        noMorePostsToFetch: false
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
      //always return false because the user's profile page feed is not refreshable
      return false;
    },

    getNoMorePostsToFetch: function() {
      return this.get('noMorePostsToFetch');
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

    getNumPosts: function() {
      return this.get('numPosts');
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
    }

});

module.exports = profileStore;
