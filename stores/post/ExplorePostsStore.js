'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var immutable = require('immutable');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var PostUtils = require('../../Utils/Post/PostUtils');

var INITIAL_PAGE_OFFSET = 0;
var MAX_POSTS_PER_PAGE = 10;

var explorePostsStore = Unicycle.createStore({

  //TODO: This is a hacky way for the Post component's _getOnPhotoClickActionName
  //      action to be able to determine which like post action to execute.  It
  //      can either be 'likeHomeFeedPost' or 'likeExploreFeedPost'
  isHomeFeed: function() {
    return false;
  },

  init: function() {
    this.set({
      posts: [],
      isRequestInFlight: false,
      isExploreFeedRefreshing: false,
      isLoadMorePostsRequestInFlight: false,
      isLikeRequestInFlight: false,
      isPostCommentRequestInFlight: false,
      noMorePostsToFetch: false,
      exploreFeedPageOffset: INITIAL_PAGE_OFFSET,
      pageLoadError: false,
    });
  },

  $requestExploreFeed(userId) {
    var that = this,
        offset = this.getExploreFeedPageOffset();

    if (offset == INITIAL_PAGE_OFFSET) {
      this.set({
        isRequestInFlight: true,
        posts: []
      });
    }
    else {
      this.set({
        isLoadMorePostsRequestInFlight: true
      });
    }

    AjaxUtils.ajax(
      '/feed/getExploreFeed',
      {
        userIdString: userId,
        maxNumberOfPostsToFetch: MAX_POSTS_PER_PAGE,
        fetchOffsetAmount: offset
      },
      (res) => {
        var newPosts = immutable.List(PostUtils.createPostsJsonFromGreedy(res.body.posts, offset));
        var allPosts = that.getPosts().concat(newPosts);

        that.set({
          posts: allPosts,
          exploreFeedPageOffset: offset + MAX_POSTS_PER_PAGE,
          isRequestInFlight: false,
          isLoadMorePostsRequestInFlight: false,
          noMorePostsToFetch: !res.body.moreResults,
          pageLoadError: false
        });
      },
      () => {
        that.set({
          isRequestInFlight: false,
          isLoadMorePostsRequestInFlight: false,
          pageLoadError: true
        });
      }
    );
  },

  $refreshExploreFeed: function(userId) {
    var that = this,
        originalOffset = this.getExploreFeedPageOffset();

    this.set({
      isExploreFeedRefreshing: true
    });

    AjaxUtils.ajax(
      '/feed/getExploreFeed',
      {
        userIdString: userId,
        maxNumberOfPostsToFetch: MAX_POSTS_PER_PAGE,
        fetchOffsetAmount: 0
      },
      (res) => {
        var newPosts = immutable.List(PostUtils.createPostsJsonFromGreedy(res.body.posts, 0)),
            currentPosts = that.getPosts(),
            allPosts = PostUtils.compressNewestPostsIntoCurrentPosts(newPosts, currentPosts);

        if (allPosts) {
          var numPostsAdded = allPosts.size - currentPosts.size,
              newOffset = originalOffset + numPostsAdded;

          that.set({
            posts: allPosts,
            exploreFeedPageOffset: newOffset,
            isExploreFeedRefreshing: false
          });
        }
        else {
          that.set({
            noMorePostsToFetch: false,
            posts: newPosts,
            isExploreFeedRefreshing: false,
            exploreFeedPageOffset: newPosts.size
          });
        }
      },
      () => {
        that.set({
          isExploreFeedRefreshing: false
        });
      }
    );
  },

  $likeExploreFeedPost(id, postId, userId) {
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

  $removeLikeExploreFeed(id, postId, userId) {
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

  $refreshExploreFeedData: function() {
    this.set({
      exploreFeedPageOffset: INITIAL_PAGE_OFFSET,
      noMorePostsToFetch: false,
      posts: []
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

  anyErrorsLoadingPage: function() {
    return this.get('pageLoadError');
  },

  isRequestInFlight: function() {
    return this.get('isRequestInFlight');
  },

  isFeedRefreshing: function() {
    return this.get('isExploreFeedRefreshing');
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

  getPosts: function() {
    return this.get('posts');
  },

  getExploreFeedPageOffset: function() {
    return this.get('exploreFeedPageOffset');
  }

});

module.exports = explorePostsStore;
