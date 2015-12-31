'use strict';

var request = require('superagent');
var prefix = require('superagent-prefix')('http://greedyapi.elasticbeanstalk.com');

var PostUtils = {

  removePostAjax: function(id, postId, userId, onSuccessCallback, onFailureCallback) {
    request
     .post('/post/removeLike')
     .use(prefix)
     .send({
       postIdString: postId,
       userIdString: userId
     })
     .set('Accept', 'application/json')
     .end(function(err, res) {
       if ((res !== undefined) && (res.ok) && (res.body.success)) {
         onSuccessCallback(id);
       }
       else {
         onFailureCallback();
       }
    });
  },

  getHomeFeedAjax: function(data, onSuccessCallback, onFailureCallback) {
    request
     .post('/feed/getHomeFeed')
     .use(prefix)
     .send(data)
     .set('Accept', 'application/json')
     .end(function(err, res) {
       if ((res !== undefined) && (res.ok)) {
         onSuccessCallback(res);
       }
       else {
         onFailureCallback();
       }
    });
  },

  //TODO: Clean up this method, its too big
  compressNewestPostsIntoCurrentPosts: function(newPosts, currentPosts) {
    var index = null,
        currentFirstPostIdString = currentPosts.get(0).postIdString;

    //find the newest post, if any
    for (var i = 0; i < newPosts.size; i++) {
      var newPost = newPosts.get(i);
      if (newPost.postIdString == currentFirstPostIdString) {
        index = i;
        break;
      }
    }

    if (index != null) {
      //modify id values for existing list, so when concatting the two lists posts don't get overridden
      var keyStartIndex = index;
      for (var i = 0; i < currentPosts.size; i++) {
        var post = currentPosts.get(i);
        post.id = keyStartIndex++;
      }

      newPosts = newPosts.take(index);
      return newPosts.concat(currentPosts);
    }
    //If there are more then 10 new posts, wipe out all current posts
    //TODO: Figure out how to reset infinite scroll and offset, etc.
    //maybe we can rely on null? YUCK!
    else {
      return null;
    }
  }

}

module.exports = PostUtils;
