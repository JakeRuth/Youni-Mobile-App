'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var immutable = require('immutable');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var PostUtils = require('../../Utils/Post/PostUtils');
var ExploreFeedEndpoints = require('../../Utils/Enums/ExploreFeedEndpoints');
var userLoginMetadataStore = require('../UserLoginMetadataStore');

var INITIAL_PAGE_OFFSET = 0;
var MAX_POSTS_PER_PAGE = 12;

var explorePostsStore = Unicycle.createStore({

  init: function() {
    this.set({
      posts: [],
      isRequestInFlight: false,
      isExploreFeedRefreshing: false,
      isLoadMorePostsRequestInFlight: false,
      isLikeRequestInFlight: false,
      noMorePostsToFetch: false,
      exploreFeedPageOffset: INITIAL_PAGE_OFFSET,
      pageLoadError: false,
      exploreFeedEndpoint: ExploreFeedEndpoints.DEFAULT
    });
  },

  $requestExploreFeed(userId, shouldUseRecursersion) {
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
      this._getExploreFeedEndpoint(),
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
          exploreFeedPageOffset: offset + MAX_POSTS_PER_PAGE,
          isRequestInFlight: false,
          isLoadMorePostsRequestInFlight: false,
          noMorePostsToFetch: !res.body.moreResults,
          pageLoadError: false
        });

        // get two pages at a time, pass false to make sure this isn't called again
        if (shouldUseRecursersion) {
          Unicycle.exec('requestExploreFeed', userId);
        }
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

  $refreshExploreFeed: function(userId, shouldUseRecursersion) {
    var that = this;

    this.set({
      isExploreFeedRefreshing: true
    });

    AjaxUtils.ajax(
      this._getExploreFeedEndpoint(),
      {
        userIdString: userId,
        maxNumberOfPostsToFetch: MAX_POSTS_PER_PAGE,
        fetchOffsetAmount: 0
      },
      (res) => {
        var newPosts = immutable.List(PostUtils.createPostsJsonFromGreedy(res.body.posts, 0));

        that.set({
          posts: newPosts,
          exploreFeedPageOffset: MAX_POSTS_PER_PAGE,
          isExploreFeedRefreshing: false,
          noMorePostsToFetch: !res.body.moreResults
        });

        // get two pages at a time, pass false to make sure this isn't called again
        if (shouldUseRecursersion) {
          Unicycle.exec('requestExploreFeed', userId);
        }
      },
      () => {
        that.set({
          isExploreFeedRefreshing: false
        });
      }
    );
  },

  $likeExploreFeedPost(id, postId, userId, callback) {
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

  $removeLikeExploreFeed(id, postId, userId, callback) {
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
        PostUtils.addCommentFromList(posts, post.id, comment, commenterName, commenterProfileImage);
        callback(comment);
      },
      () => {
        callback(comment);
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

  getNoMorePostsToFetch: function() {
    return this.get('noMorePostsToFetch');
  },

  getPosts: function() {
    return this.get('posts');
  },

  getExploreFeedPageOffset: function() {
    return this.get('exploreFeedPageOffset');
  },

  _getExploreFeedEndpoint: function() {
    return this.get('exploreFeedEndpoint');
  },

  setExploreFeedEndpoint: function(endpoint) {
    var currentEndpoint = this._getExploreFeedEndpoint();

    if (currentEndpoint !== endpoint) {
      this.set({
        exploreFeedEndpoint: endpoint
      });
      Unicycle.exec('refreshExploreFeed', userLoginMetadataStore.getUserId(), true);
    }
  }

});

module.exports = explorePostsStore;
