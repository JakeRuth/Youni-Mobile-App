'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var immutable = require('immutable');
var PostUtils = require('../../Utils/Post/PostUtils');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');

var INITIAL_PAGE_OFFSET = 0;
var MAX_POSTS_PER_PAGE = 10;

var profileOwnerStore = Unicycle.createStore({

    init: function () {
      //TODO: Figure out why we can't call `this._setInitialState()` here...
      this.set({
        pageLoadError: false,
        isRequestInFlight: false,
        isUserPostsRequestInFlight: false,
        isLoadMorePostsRequestInFlight: false,
        isLikeRequestInFlight: false,
        isPostCommentRequestInFlight: false,
        isProfileOwnerFeedRefreshing: false,
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

    $reInitProfilePageState: function() {
      this._setInitialState();
    },

    $loadOwnerUsersProfile(email) {
      var that = this;

      this.set({
        pageLoadError: false,
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
            numPosts: res.body.userDetails['numPosts'],
            totalPoints: res.body.userDetails['allTimePoints']
          });
        },
        () => {
          that.set({
            pageLoadError: true,
            isRequestInFlight: false
          });
        }
      );
    },

    $deletePost(id, postId, userId) {
      var posts = this.getPosts(),
          numPosts = this.getNumPosts() - 1;
      //optimistically remove post from list, then call api to delete
      this.set({
        posts: PostUtils.removePostFromList(posts, id),
        numPosts: numPosts
      });

      AjaxUtils.ajax(
        '/post/delete',
        {
          postIdString: postId,
          userIdString: userId
        },
        (res) => {
          //TODO: Implement me!
        },
        () => {
          //TODO: Implement me!
        }
      );
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

      AjaxUtils.ajax(
        '/user/getPosts',
        {
          userEmail: userEmail,
          requestingUserIdString: userId,
          maxNumberOfPostsToFetch: MAX_POSTS_PER_PAGE,
          fetchOffsetAmount: offset
        },
        (res) => {
          var currentPostsSize = this.getPosts().size,
              postsArray = PostUtils.createPostsJsonFromGreedy(res.body.posts, currentPostsSize),
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
      var that = this;

      this.set({
        isProfileOwnerFeedRefreshing: true
      });

      AjaxUtils.ajax(
        '/user/getPosts',
        {
          userEmail: userEmail,
          requestingUserIdString: userId,
          maxNumberOfPostsToFetch: MAX_POSTS_PER_PAGE,
          fetchOffsetAmount: 0
        },
        (res) => {
          var postsArray = PostUtils.createPostsJsonFromGreedy(res.body.posts, 0),
              newPosts = immutable.List(postsArray);

          that.set({
            posts: newPosts,
            feedPageOffset: MAX_POSTS_PER_PAGE,
            isProfileOwnerFeedRefreshing: false,
            noMorePostsToFetch: !res.body.moreResults
          });
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

    $removeLikeProfileOwner(id, postId, userId) {
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

    setBio: function(bio) {
        this.set({
            bio: bio
        });
    },

    setFirstName: function(firstName) {
        this.set({
            firstName: firstName
        });
    },

    setLastName: function(lastName) {
        this.set({
            lastName: lastName
        });
    },

    $setProfileImageUrl: function(url) {
      this.set({
        profileImageUrl: url
      });
    },

    addCommentOnPost: function(id, postIdString, userIdString, comment, commenterName, callback) {
      var posts = this.getPosts(),
          that = this;

      AjaxUtils.ajax(
        '/post/createComment',
        {
          postIdString: postIdString,
          userIdString: userIdString,
          comment: comment
        },
        (res) => {
          that.set({
            posts: PostUtils.addComment(posts, id, comment, commenterName)
          });
          callback();
        },
        () => {
          callback();
        }
      );
    },

    anyErrorsLoadingPage: function() {
      return this.get('pageLoadError');
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
      return this.get('isProfileOwnerFeedRefreshing');
    },

    getNoMorePostsToFetch: function() {
      return this.get('noMorePostsToFetch');
    },

    getUserJson: function() {
      return {
        firstName: this.getFirstName(),
        lastName: this.getLastName(),
        numFollowers: this.getNumFollowers(),
        bio: this.getBio(),
        email: this.getEmail(),
        profileImageUrl: this.getProfileImageUrl(),
        numPosts: this.getNumPosts(),
        totalPoints: this.getTotalPoints()
      };
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
    },

    _setInitialState: function() {
      this.set({
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
