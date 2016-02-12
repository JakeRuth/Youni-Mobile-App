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
        isPostCommentRequestInFlight: false,
        noMorePostsToFetch: false,
        firstName: '',
        lastName: '',
        numFollowers: 0,
        numPosts: 0,
        totalPoints: 0,
        bio: '',
        profileImageUrl: '',
        email: '',
        posts: [],
        feedPageOffset: INITIAL_PAGE_OFFSET
      });
    },

    $loadUsersProfile(email) {
      var that = this;

      // first name and last name need to be cleared so the banner doesn't
      // show the previous name while loading the profile info
      this.set({
        isRequestInFlight: true,
        firstName: '',
        lastName: ''
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
            numPosts: res.body.userDetails['numPosts'],
            totalPoints: res.body.userDetails['allTimePoints']
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
        () => {
          that.set({
            isUserPostsRequestInFlight: false,
            isLoadMorePostsRequestInFlight: false
          });
        }
      );
    },

    $likePostFromProfilePage(id, postId, userId) {
      var that = this,
          posts = this.get('posts');

      if (!this.isLikeRequestInFlight()) {
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
      }
    },

    $removeLikeProfile(id, postId, userId) {
      var posts = this.get('posts'),
          that = this;

      if (!this.isLikeRequestInFlight()) {
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
      }
    },

    $reInitializeUsersProfileFeedOffset: function() {
      this.set({
        feedPageOffset: INITIAL_PAGE_OFFSET,
        noMorePostsToFetch: false
      });
    },

    addCommentOnPost: function(id, postIdString, userIdString, comment, commenterName, callback) {
      var posts = this.getPosts(),
          that = this;

      this.set({
        isPostCommentRequestInFlight: true
      });

      AjaxUtils.ajax(
        '/post/createComment',
        {
          postIdString: postIdString,
          userIdString: userIdString,
          comment: comment
        },
        (res) => {
          that.set({
            posts: PostUtils.addComment(posts, id, comment, commenterName),
            isPostCommentRequestInFlight: false
          });
          callback();
        },
        () => {
          that.set({
            isPostCommentRequestInFlight: false
          });
        }
      );
    },

    incrementFollowersCount: function() {
      var newFollowerCount = this.get('numFollowers');
      this.set({
        numFollowers: ++newFollowerCount
      });
    },

    decrementFollowersCount: function() {
      var newFollowerCount = this.get('numFollowers');
      this.set({
        numFollowers: --newFollowerCount
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

    isPostCommentRequestInFlight: function() {
      return this.get('isPostCommentRequestInFlight');
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

    getTotalPoints: function() {
      return this.get('totalPoints');
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
