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
        commenterEmail: comment.commenterEmail,
        commenterProfilePicture: comment.commenterProfilePicture
      });
    }
    return commentsJson;
  },

  increaseLikeCountFromList: function(posts, id) {
    var post = posts.get(id);
    post = this.likePost(post);
    posts = posts.set(id, post);
    return posts;
  },

  likePost: function(post) {
    post.numLikes++;
    post.liked = true;
    return post;
  },

  decreaseLikeCountFromList: function(posts, id) {
    var post = posts.get(id);
    post = this.unlikePost(post);
    posts = posts.set(id, post);
    return posts;
  },

  unlikePost: function(post) {
    post.numLikes--;
    post.liked = false;
    return post;
  },

  addCommentFromList: function(posts, id, commentText, commenterName, commenterProfilePicture) {
    var post = posts.get(id);
    post = this.addComment(post, commentText, commenterName, commenterProfilePicture);
    posts = posts.set(id, post);
    return posts;
  },

  addComment: function(post, commentText, commenterName, commenterProfilePicture) {
    post.numComments++;

    if (post.firstComments.length < this.DEFAULT_MAX_COMMENTS_VISIBLE) {
      post.firstComments.push({
        comment: commentText,
        commenterName: commenterName,
        commenterProfilePicture: commenterProfilePicture
      });
    }

    return post;
  },

  removePostFromList: function(posts, postId) {
    posts = posts.delete(postId);
    posts = this._resetPostsJson(posts);
    return posts;
  },

  removePostsFromList: function(posts, postIds) {
    for (var i = 0; i < postIds.length; i++) {
      posts = posts.delete(postIds[i]);
    }
    
    return posts;
  },

  getPostJson: function(post, index) {
    return {
      posterProfileImageUrl: post.posterProfilePictureUrl,
      postIdString: post.postIdString,
      firstComments: post.firstComments,
      numComments: post.numComments,
      posterEmail: post.posterEmail,
      posterName: post.posterName,
      timestamp: post.timestamp,
      photoUrl: post.photoUrl,
      numLikes: post.numLikes,
      caption: post.caption,
      liked: post.liked,
      imageHeight: post.photoHeight,
      imageWidth: post.photoWidth,
      id: index,
      isPostUserCurrentlyTrending: post.isCurrentlyTrending,
      groups: post.groups
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
