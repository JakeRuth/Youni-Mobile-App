'use strict';

var Unicycle = require('../../Unicycle');
var immutable = require('immutable');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var PostUtils = require('../../Utils/Post/PostUtils');
var userLoginMetadataStore = require('../UserLoginMetadataStore');

var INITIAL_PAGE_OFFSET = 0;
var MAX_POSTS_PER_PAGE = 51;

var homePostsStore = Unicycle.createStore({

  init: function() {
    this.set({
      posts: [],
      isRequestInFlight: true,
      isHomeFeedRefreshing: false,
      isLoadMorePostsRequestInFlight: false,
      isLikeRequestInFlight: false,
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
        var currentPostsSize = this.getPosts().size;
        var newPosts = immutable.List(PostUtils.createPostsJsonFromGreedy(res.body.posts, currentPostsSize));
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

  // Deprecated! Do not use this.
  // There is a weird bug with pictures not properly refreshing which leads to the wrong photos being displayed on the wrong posts
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

        that.set({
          homeFeedPageOffset: MAX_POSTS_PER_PAGE,
          posts: newPosts,
          isHomeFeedRefreshing: false,
          isRequestInFlight: false,
          noMorePostsToFetch: !res.body.moreResults
        });
      },
      () => {
        that.set({
          isHomeFeedRefreshing: false,
          isRequestInFlight: false
        });
      }
    );
  },

  $likeHomeFeedPost(id, postId, userId, callback) {
    var that = this,
        posts = this.get('posts');

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
        () => {
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

  $removeLikeHomeFeed(id, postId, userId, callback) {
    var posts = this.get('posts'),
        that = this;

    if (!this.isLikeRequestInFlight()) {
      // optimistically unlike the post
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
        () => {
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
        that.notifyListeners();
        callback();
      },
      () => {

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
