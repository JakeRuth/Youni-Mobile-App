'use strict';

var immutable = require('immutable');
var Unicycle = require('../../Unicycle');

var userLoginMetadataStore = require('../UserLoginMetadataStore');
var PostUtils = require('../../Utils/Post/PostUtils');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var PostViewType = require('../../Utils/Enums/PostViewType');

var INITIAL_PAGE_OFFSET = 0;
var MAX_POSTS_PER_PAGE = 51;

var profileOwnerStore = Unicycle.createStore({

    init: function () {
      //TODO: Figure out why we can't call `this._setInitialState()` here...
      this.set({
        pageLoadError: false,
        isProfileInfoLoading: false,
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
        userInviteToken: '',
        posts: [],
        postViewMode: PostViewType.GRID,
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
        isProfileInfoLoading: true
      });

      AjaxUtils.ajax(
        '/user/getProfileInformation',
        {
          userEmail: email
        },
        (res) => {
          that.set({
            isProfileInfoLoading: false,
            firstName: res.body.userDetails['firstName'],
            lastName: res.body.userDetails['lastName'],
            numFollowers: res.body.userDetails['numFollowers'],
            bio: res.body.userDetails['bio'],
            email: res.body.userDetails['email'],
            profileImageUrl: res.body.userDetails['profileImageUrl'],
            numPosts: res.body.userDetails['numPosts'],
            totalPoints: res.body.userDetails['allTimePoints'],
            userInviteToken: res.body.userDetails['userInviteCode']
          });
        },
        () => {
          that.set({
            pageLoadError: true,
            isProfileInfoLoading: false
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

    $getOwnerUserPosts(userEmail, userId, shouldRecurse) {
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

          if (shouldRecurse) {
            Unicycle.exec('getOwnerUserPosts', userEmail, userId)
          }
        },
        () => {
          that.set({
            isUserPostsRequestInFlight: false,
            isLoadMorePostsRequestInFlight: false
          });
        }
      );
    },

    $likePostFromOwnerProfilePage(id, postId, userId, callback) {
      var that = this;
      var posts = this.get('posts');

      if (!this.isLikeRequestInFlight()) {
        // optimistically like the post
        this.set({
          posts: PostUtils.increaseLikeCountFromList(posts, id),
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
              isLikeRequestInFlight: false
            });
            callback();
          },
          () => {
            that.set({
              isLikeRequestInFlight: false
            });
            callback();
          }
        );
      }
    },

    $removeLikeProfileOwner(id, postId, userId, callback) {
      var posts = this.get('posts'),
          that = this;

      if (!this.isLikeRequestInFlight()) {
        //optimistically unlike the post
        this.set({
          posts: PostUtils.decreaseLikeCountFromList(posts, id),
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
              isLikeRequestInFlight: false
            });
            callback();
          },
          () => {
            that.set({
              isLikeRequestInFlight: false
            });
            callback();
          }
        );
      }
    },

    resetPostPageOffset: function() {
        this.set({
            feedPageOffset: INITIAL_PAGE_OFFSET
        });
    },

    setBio: function(bio) {
        if (!bio) return;
      
        this.set({
            bio: bio
        });
    },

    setFirstName: function(firstName) {
        if (!firstName) return;

        this.set({
            firstName: firstName
        });
    },

    setLastName: function(lastName) {
        if (!lastName) return;

        this.set({
            lastName: lastName
        });
    },
  
    setPostViewMode: function(value) {
      this.set({
        postViewMode: value
      });
    },

    $setProfileImageUrl: function(url) {
      this.set({
        profileImageUrl: url
      });
    },

    addCommentOnPost: function(comment, post, callback) {
      var posts = this.getPosts(),
          userId = userLoginMetadataStore.getUserId(),
          commenterName = userLoginMetadataStore.getFullName(),
          commenterProfileImage = userLoginMetadataStore.getProfileImageUrl();

      if (!comment) {
        return;
      }

      AjaxUtils.ajax(
        '/post/createComment',
        {
          postIdString: post.postIdString,
          userIdString: userId,
          comment: comment
        },
        (res) => {
          PostUtils.addCommentFromList(posts, post.id, comment, commenterName, commenterProfileImage, res.body.commentId);
          callback(comment);
        },
        () => {
          callback(comment);
        }
      );
    },

    deleteCommentFromPost: function(comment, post, callback) {
      var posts = this.getPosts(),
          userId = userLoginMetadataStore.getUserId(),
          that = this;
  
      AjaxUtils.ajax(
        '/post/deleteComment',
        {
          commentIdString: comment.id,
          userIdString: userId
        },
        (res) => {
          PostUtils.deleteCommentFromList(posts, post.id, res.body.firstComments);
          callback();
          that.notifyListeners();
        },
        () => {
  
        }
      );
    },

    anyErrorsLoadingPage: function() {
      return this.get('pageLoadError');
    },

    isProfileInfoLoading() {
      return this.get('isProfileInfoLoading');
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
        totalPoints: this.getTotalPoints(),
        userInviteToken: this.getUserInviteToken()
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
  
    getUserInviteToken: function () {
      return this.get('userInviteToken');
    },

    getPosts: function() {
      return this.get('posts');
    },
  
    getPostViewMode: function() {
      return this.get('postViewMode');
    },

    getFeedPageOffset: function() {
      return this.get('feedPageOffset');
    },

    _setInitialState: function() {
      this.set({
        isProfileInfoLoading: false,
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
