'use strict';

var immutable = require('immutable');

var PostUtils = {

  DEFAULT_MAX_COMMENTS_VISIBLE: 3,

  createPostsJsonFromGreedy: function(posts, currentPageOffset) {
    var postsJson = [];

    for (var i = currentPageOffset; i < posts.length + currentPageOffset; i++) {
      var post = posts[i - currentPageOffset];
      postsJson.push({
        posterProfileImageUrl: post['posterProfilePictureUrl'],
        postIdString: post['postIdString'],
        firstComments: post['firstComments'],
        moreComments: post['moreComments'],
        numComments: post['numComments'],
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
  },

  //TODO: Fix me. BAD
  createCommentsJsonFromGreedy: function(comments) {
    var commentsJson = [];

    for (var i = comments.length - 1; i >= 0; i--) {
      var comment = comments[i];
      commentsJson.push({
        comment: comment.comment,
        commenterName: comment.commenterName
      });
    }
    return commentsJson;
  },

  increaseLikeCount: function(posts, id) {
    var post = posts.get(id);
    post.numLikes++;
    post.liked = true;
    posts = posts.set(id, post);
    return posts;
  },

  decreaseLikeCount: function(posts, id) {
    var post = posts.get(id);
    post.numLikes--;
    post.liked = false;
    posts = posts.set(id, post);
    return posts;
  },

  addComment: function(posts, id, commentText, commenterName) {
    var post = posts.get(id);
    post.numComments++;

    if (post.firstComments.length < this.DEFAULT_MAX_COMMENTS_VISIBLE) {
      post.firstComments.push({
        comment: commentText,
        commenterName: commenterName
      });
    }
    else {
      post.moreComments = true;
    }
    
    posts = posts.set(id, post);
    return posts;
  },

  removePostFromList: function(posts, postId) {
    posts = posts.delete(postId);
    posts = this._resetPostsJson(posts);
    return posts;
  },

  compressNewestPostsIntoCurrentPosts: function(newPosts, currentPosts) {
    var index = null,
        currentFirstPostIdString = currentPosts.get(0).postIdString;

    //find the first occurance of a post in the current list that matches
    //the incoming 10 posts.  Index coincidentally be the number of new posts
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
    //TODO: Figure out how to reset infinite scroll and offset, etc.
    //maybe we can rely on null? YUCK!
    else {
      return null;
    }
  },

  _resetPostsJson: function(posts) {
    var postsJson = [];

    for (var i = 0; i < posts.size; i++) {
      var post = posts.get(i);
      postsJson.push({
        posterProfileImageUrl: post.posterProfileImageUrl,
        postIdString: post.postIdString,
        posterName: post.posterName,
        timestamp: post.timestamp,
        photoUrl: post.photoUrl,
        numLikes: post.numLikes,
        caption: post.caption,
        liked: post.liked,
        id: i
      });
    }
    return immutable.List(postsJson);
  }

}

module.exports = PostUtils;
