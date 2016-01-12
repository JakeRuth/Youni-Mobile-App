'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var PostUtils = require('../../Utils/Post/PostUtils');

var postCommentsModalStore = Unicycle.createStore({

  init: function() {
    this.set({
      isVisible: false,
      isRequestInFlight: false,
      comments: [],
      id: null,
      postIdString: null,
      posterEmail: null,
      posterName: null,
      posterProfileImageUrl: null,
      timestamp: null,
      postStore: null,
      moreCommentsToShow: null,
      numComments: null
    });
  },

  getAllCommentsForPost: function(postIdString) {
    var that = this;

    this.set({
      isRequestInFlight: true,
      isVisible: true
    });

    AjaxUtils.ajax(
      '/post/getComments',
      {
        postIdString: postIdString
      },
      (res) => {
        var comments = PostUtils.createCommentsJsonFromGreedy(res.body.comments);
        that.set({
          isRequestInFlight: false,
          comments: comments
        });
      },
      () => {
        that.set({
          isRequestInFlight: false,
          isVisible: false
        });
      }
    );
  },

  addComment: function(commentText, commenterName) {
    var comments = this.getComments();
    comments.push({
      comment: commentText,
      commenterName: commenterName
    });
    this.set({
      comments: comments
    });
  },

  setPostCommentsModalVisibile: function(isVisible) {
    this.set({
      isVisible: isVisible
    });
  },

  setAllPostInfo: function(
    id,
    postIdString,
    posterEmail,
    posterName,
    posterProfileImageUrl,
    timestamp,
    postStore,
    moreCommentsToShow,
    numComments
  ) {
    this.set({
      id: id,
      postIdString: postIdString,
      posterEmail: posterEmail,
      posterName: posterName,
      posterProfileImageUrl: posterProfileImageUrl,
      timestamp: timestamp,
      postStore: postStore,
      moreCommentsToShow: moreCommentsToShow,
      numComments: numComments
    });
  },

  isRequestInFlight: function() {
    return this.get('isRequestInFlight');
  },

  getId: function() {
    return this.get('id');
  },

  getPostIdString: function() {
    return this.get('postIdString');
  },

  getPosterEmail: function() {
    return this.get('posterEmail');
  },

  getComments: function() {
    return this.get('comments').toJS();
  },

  getPosterName: function() {
    return this.get('posterName');
  },

  getPosterProfileImageUrl: function() {
    return this.get('posterProfileImageUrl');
  },

  getTimestamp: function() {
    return this.get('timestamp');
  },

  getMoreCommentsToShow: function() {
    return this.get('moreCommentsToShow');
  },

  getPostStore: function() {
    return this.get('postStore');
  },

  getNumComments: function() {
    return this.get('numComments');
  },

  getIsVisible: function() {
    return this.get('isVisible');
  }

});

module.exports = postCommentsModalStore;
