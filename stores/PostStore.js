'use strict';

var React = require('react-native');
var Unicycle = require('./../Unicycle');
var request = require('superagent');
var prefix = require('superagent-prefix')('http://localhost:8080/Greedy');

var postStore = Unicycle.createStore({

  init: function() {
    this.set({
      posts: [],
      isRequestInFlight: false
    });
  },

  $requestExploreFeed() {
    var posts = [];
    var that = this;

    this.set({
      isRequestInFlight: true
    });

    request
     .post('/feed/getExploreFeed')
     .use(prefix)
     .send({
       maxNumberOfPostsToFetch: 100, //TODO: enable paged results
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
       } else {
         //TODO: implement failed case (show user error message or cached results)
       }
    });
  },

  //TODO: this will be completely different with api integration
  $likePost(postId) {
    var posts = this.get('posts');
    var post = posts.get(postId);
    var numLikes = post.get('numLikes');

    post = post.set('numLikes', ++numLikes);
    posts = posts.set(postId, post);
    this.set({
      posts: posts
    });
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
        id: post['postIdString'],
        posterName: post['posterName'],
        timestamp: post['timestamp'],
        photoUrl: post['photoUrl'],
        numLikes: post['numLikes'],
        caption: post['caption'],
        postIdString: i
      });
    }
    return postsJson;
  }

});

module.exports = postStore;
