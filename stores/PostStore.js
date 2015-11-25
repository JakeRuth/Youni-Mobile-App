'use strict';

var React = require('react-native');
var Unicycle = require('./../Unicycle');
var request = require('superagent');
var prefix = require('superagent-prefix')('http://greedyapi.elasticbeanstalk.com');

var postStore = Unicycle.createStore({

  init: function() {
    this.set({
      posts: [],
      isRequestInFlight: false,
      isLikeRequestInFlight: false
    });
  },

  $requestExploreFeed(userId) {
    var posts = [];
    var that = this;

    this.set({
      isRequestInFlight: true
    });

    request
     .post('/feed/getExploreFeed')
     .use(prefix)
     .send({
       userIdString: userId,
       maxNumberOfPostsToFetch: 10, //TODO: enable paged results
       fetchOffsetAmount: 0
     })
     .set('Accept', 'application/json')
     .end(function(err, res) {
       if ((res !== undefined) && (res.ok)) {
         posts = that._createPostsJsonFromResponse(res.body.posts);
         that.set({
           posts: posts,
           isRequestInFlight: false
         });
       }
       else {
         //TODO: implement failed case (show user error message or cached results)
       }
    });
  },
  //TODO: Look to combine both methods that are getting the feeds
  $requestHomeFeed(userId) {
    var posts = [];
    var that = this;

    this.set({
      isRequestInFlight: true
    });

    request
     .post('/feed/getHomeFeed')
     .use(prefix)
     .send({
       userIdString: userId,
       maxNumberOfPostsToFetch: 10, //TODO: enable paged results
       fetchOffsetAmount: 0
     })
     .set('Accept', 'application/json')
     .end(function(err, res) {
       if ((res !== undefined) && (res.ok)) {
         posts = that._createPostsJsonFromResponse(res.body.posts);
         that.set({
           posts: posts,
           isRequestInFlight: false
         });
       }
       else {
         //TODO: implement failed case (show user error message or cached results)
       }
    });
  },

  $likePost(id, postId, userId) {
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
         var numLikes = post.get('numLikes');
         post = post.set('numLikes', ++numLikes);
         post = post.set('liked', true);
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

  isLikeRequestInFlight: function() {
    return this.get('isLikeRequestInFlight');
  },

  getPosts: function() {
    return this.get('posts');
  },

  getIsRequestInFlight: function() {
    return this.get('isRequestInFlight');
  },

  _createPostsJsonFromResponse: function(posts) {
    var postsJson = [];
    for (var i = 0; i < posts.length; i++) {
      var post = posts[i];
      postsJson.push({
        posterProfileImageUrl: post['posterProfilePictureUrl'],
        postIdString: post['postIdString'],
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

module.exports = postStore;
