'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var immutable = require('immutable');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var PostUtils = require('../../Utils/Post/PostUtils');

var INITIAL_PAGE_OFFSET = 0;
var MAX_POSTS_PER_PAGE = 10;

var homePostsStore = Unicycle.createStore({

  //TODO: This is a hacky way for the Post component's _getOnPhotoClickActionName
  //      action to be able to determine which like post action to execute.  It
  //      can either be 'likeHomeFeedPost' or 'likeExploreFeedPost'
  isHomeFeed: function() {
    return true;
  },

  init: function() {
    this.set({
      posts: [],
      isRequestInFlight: false,
      isHomeFeedRefreshing: false,
      isLoadMorePostsRequestInFlight: false,
      isLikeRequestInFlight: false,
      noMorePostsToFetch: false,
      homeFeedPageOffset: INITIAL_PAGE_OFFSET,
      pageLoadError: false
    });
  },

  $requestHomeFeed(userId) {
    var that = this,
        offset = this.getHomeFeedPageOffset();

    if (offset == INITIAL_PAGE_OFFSET) {
      this.set({
        isRequestInFlight: true,
        posts: [],
        pageLoadError: false
      });
    }
    else {
      this.set({
        isLoadMorePostsRequestInFlight: true
      });
    }

    AjaxUtils.ajax(
      '/feed/getHomeFeed',
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
          homeFeedPageOffset: offset + MAX_POSTS_PER_PAGE,
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
          pageLoadError: true,
          homeFeedPageOffset: INITIAL_PAGE_OFFSET,
          noMorePostsToFetch: false,
          posts: []
        });
      }
    );
  },

  $refreshHomeFeed(userId) {
    var that = this,
        originalOffset = this.getHomeFeedPageOffset();

    this.set({
      isHomeFeedRefreshing: true
    });

    AjaxUtils.ajax(
      '/feed/getHomeFeed',
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
            homeFeedPageOffset: newOffset,
            posts: allPosts,
            isHomeFeedRefreshing: false
          });
        }
        else {
          that.set({
            noMorePostsToFetch: false,
            posts: newPosts,
            isHomeFeedRefreshing: false,
            homeFeedPageOffset: newPosts.size
          });
        }
      },
      () => {
        that.set({
          isHomeFeedRefreshing: false
        });
      }
    );
  },

  $likeHomeFeedPost(id, postId, userId) {
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
      () => {
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

  $removeLikeHomeFeed(id, postId, userId) {
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
      () => {
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

  $refreshHomeFeedData: function() {
    this.set({
      homeFeedPageOffset: INITIAL_PAGE_OFFSET,
      noMorePostsToFetch: false,
      posts: []
    });
  },

  anyErrorsLoadingPage: function() {
    return this.get('pageLoadError');
  },

  isRequestInFlight: function() {
    return this.get('isRequestInFlight');
  },

  isFeedRefreshing: function() {
    return this.get('isHomeFeedRefreshing');
  },

  isLoadMorePostsRequestInFlight: function() {
    return this.get('isLoadMorePostsRequestInFlight');
  },

  isLikeRequestInFlight: function() {
    return this.get('isLikeRequestInFlight');
  },

  getNoMorePostsToFetch: function() {
    return this.get('noMorePostsToFetch');
  },

  getPosts: function() {
    return this.get('posts');
  },

  getHomeFeedPageOffset: function() {
    return this.get('homeFeedPageOffset');
  }

});

module.exports = homePostsStore;
