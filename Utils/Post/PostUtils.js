'use strict';

var immutable = require('immutable');

var PostUtils = {

  DEFAULT_MAX_COMMENTS_VISIBLE: 3,

  createPostsJsonFromGreedy: function(posts, currentPageOffset) {
    var postsJson = [];

    for (var i = currentPageOffset; i < posts.length + currentPageOffset; i++) {
      var post = posts[i - currentPageOffset];
      postsJson.push(this.getPostJson(post, i));
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
        commenterName: comment.commenterName,
        commenterEmail: comment.commenterEmail
      });
    }
    return commentsJson;
  },

  increaseLikeCount: function(posts, id) {
    var post = posts.get(id);
    post.numLikes++;
    post.numViews++;
    post.liked = true;
    posts = posts.set(id, post);
    return posts;
  },

  increaseViewCount: function(posts, id) {
    var post = posts.get(id);
    post.numViews++;
    posts = posts.set(id, post);
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
      post.moreCommentsToShow = true;
    }

    posts = posts.set(id, post);
    return posts;
  },

  removePostFromList: function(posts, postId) {
    posts = posts.delete(postId);
    posts = this._resetPostsJson(posts);
    return posts;
  },

  trimPostCommentForFeed: function(post) {
    post.firstComments = post.firstComments.slice(0, this.DEFAULT_MAX_COMMENTS_VISIBLE);
  },

  getPostJson: function(post, index) {
    return {
      posterProfileImageUrl: post.posterProfilePictureUrl,
      postIdString: post.postIdString,
      firstComments: post.firstComments,
      moreCommentsToShow: post.moreComments,
      numComments: post.numComments,
      posterEmail: post.posterEmail,
      posterName: post.posterName,
      timestamp: post.timestamp,
      photoUrl: post.photoUrl,
      numLikes: post.numLikes,
      numViews: post.numViews,
      caption: post.caption,
      liked: post.liked,
      imageHeight: post.photoHeight,
      imageWidth: post.photoWidth,
      id: index,
      isPostUserCurrentlyTrending: post.isCurrentlyTrending
    };
  },

  _resetPostsJson: function(posts) {
    var postsJson = [];

    for (var i = 0; i < posts.size; i++) {
      var post = posts.get(i);
      postsJson.push(this.getPostJson(post, i));
    }
    return immutable.List(postsJson);
  }

};

module.exports = PostUtils;
