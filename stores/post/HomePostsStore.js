'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var immutable = require('immutable');
var request = require('superagent');
var prefix = require('superagent-prefix')('http://greedyapi.elasticbeanstalk.com');

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
      isLoadMorePostsRequestInFlight: false,
      isLikeRequestInFlight: false,
      noMorePostsToFetch: false,
      homeFeedPageOffset: INITIAL_PAGE_OFFSET
    });
  },

  //TODO: Look to combine both methods that are getting the feeds
  $requestHomeFeed(userId) {
    var that = this,
        offset = this.getHomeFeedPageOffset();

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

    request
     .post('/feed/getHomeFeed')
     .use(prefix)
     .send({
       userIdString: userId,
       maxNumberOfPostsToFetch: MAX_POSTS_PER_PAGE,
       fetchOffsetAmount: offset
     })
     .set('Accept', 'application/json')
     .end(function(err, res) {
       if ((res !== undefined) && (res.ok)) {
         var newPosts = immutable.List(that.createPostsJsonFromResponse(res.body.posts, offset));
         var allPosts = that.getPosts().concat(newPosts);

         that.set({
           posts: allPosts,
           homeFeedPageOffset: offset + MAX_POSTS_PER_PAGE,
           isRequestInFlight: false,
           isLoadMorePostsRequestInFlight: false,
           noMorePostsToFetch: !res.body.moreResults
         });
       }
       else {
         //TODO: implement failed case (show user error message or cached results)
       }
    });
  },

  $likeHomeFeedPost(id, postId, userId) {
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
         var post = posts.get(id);
         post.numLikes++;
         post.liked = true;
         posts = posts.set(id, post);
         that.set({
           posts: posts,
           isLikeRequestInFlight: false
         });
       }
       else {
         //TODO: implement failed case (show user error message or cached results)
         that.set({
           isLikeRequestInFlight: false
         });
       }
    });
  },

  $refreshHomeFeedData: function() {
    this.set({
      homeFeedPageOffset: INITIAL_PAGE_OFFSET,
      noMorePostsToFetch: false,
      posts: []
    });
  },

  isRequestInFlight: function() {
    return this.get('isRequestInFlight');
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

  createPostsJsonFromResponse: function(posts, offset) {
    var postsJson = [];

    for (var i = offset; i < posts.length + offset; i++) {
      var post = posts[i - offset];
      postsJson.push({
        posterProfileImageUrl: post['posterProfilePictureUrl'],
        postIdString: post['postIdString'],
        posterEmail: post['posterEmail'],
        posterName: post['posterName'],
        timestamp: post['timestamp'],
        photoUrl: post['photoUrl'],
        numLikes: post['numLikes'],
        caption: post['caption'],
        liked: post['liked'],
        id: i
      });
    }
    return postsJson;
  }

});

module.exports = homePostsStore;
