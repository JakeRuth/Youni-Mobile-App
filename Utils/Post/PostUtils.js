'use strict';

var AjaxUtils = require('../Common/AjaxUtils');

var PostUtils = {

  ajax: function(url, data, onSuccessCallback, onFailureCallback) {
    AjaxUtils.ajax(url, data, onSuccessCallback, onFailureCallback);
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
