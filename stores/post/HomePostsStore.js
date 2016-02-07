'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var immutable = require('immutable');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var PostUtils = require('../../Utils/Post/PostUtils');
var CacheUtils = require('../../Utils/Common/CacheUtils');

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
      isRequestInFlight: true,
      isHomeFeedRefreshing: false,
      isLoadMorePostsRequestInFlight: false,
      isLikeRequestInFlight: false,
      isPostCommentRequestInFlight: false,
      noMorePostsToFetch: false,
      homeFeedPageOffset: INITIAL_PAGE_OFFSET,
      pageLoadError: false,
      scrollToTopOfPostFeed: false
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

        if (offset == INITIAL_PAGE_OFFSET) {
          CacheUtils.saveHomeFeedPosts(res.body.posts);
        }

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
    var that = this;

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
        var newPosts = immutable.List(PostUtils.createPostsJsonFromGreedy(res.body.posts, 0));
        CacheUtils.saveHomeFeedPosts(res.body.posts);

        that.set({
          homeFeedPageOffset: newPosts.size,
          posts: newPosts,
          isHomeFeedRefreshing: false,
          isRequestInFlight: false,
          noMorePostsToFetch: !res.body.moreResults
        });
      },
      () => {
        that.set({
          isHomeFeedRefreshing: false,
          isRequestInFlight: false,
        });
      }
    );
  },

  $likeHomeFeedPost(id, postId, userId) {
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
    }
  },

  $removeLikeHomeFeed(id, postId, userId) {
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
    }
  },

  $refreshHomeFeedData: function() {
    this.set({
      homeFeedPageOffset: INITIAL_PAGE_OFFSET,
      noMorePostsToFetch: false,
      posts: []
    });
  },

  $setHomeFeedPosts: function(postsJson) {
    var posts = immutable.List(PostUtils.createPostsJsonFromGreedy(postsJson, 0));
    this.set({
      posts: posts,
      isHomeFeedRefreshing: false,
      isRequestInFlight: false
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

  setScrollToTopOfPostFeed: function(value) {
    this.set({
      scrollToTopOfPostFeed: value
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

  isPostCommentRequestInFlight: function() {
    return this.get('isPostCommentRequestInFlight');
  },

  getNoMorePostsToFetch: function() {
    return this.get('noMorePostsToFetch');
  },

  getPosts: function() {
    return this.get('posts');
  },

  getHomeFeedPageOffset: function() {
    return this.get('homeFeedPageOffset');
  },

  scrollToTopOfPostFeed: function() {
    return this.get('scrollToTopOfPostFeed');
  }

});

module.exports = homePostsStore;
