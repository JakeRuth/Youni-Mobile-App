'use strict';

var Unicycle = require('../../Unicycle');

var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var PostUtils = require('../../Utils/Post/PostUtils');
var CampusChallengeUtils = require('../../Utils/CampusChallenge/CampusChallengeUtils');
var userLoginMetadataStore = require('../UserLoginMetadataStore');

var MAX_SUBMISSIONS_PER_PAGE = 10;

var campusChallengeStore = Unicycle.createStore({

  init: function () {
    this.set({
      isLoadingCurrentChallenge: true,
      currentChallenge: null,
      noCurrentChallenge: false,
      submissions: [],
      isFetchingFirstPage: false,
      isFetchingNextPage: false,
      offset: 0,
      moreToFetch: true,
      isVoteRequestInFlight: false,
      loggedInUserSubmission: null
    });
  },
  
  reInit: function() {
    this.set({
      isLoadingCurrentChallenge: true,
      currentChallenge: null,
      noCurrentChallenge: false,
      submissions: [],
      isFetchingFirstPage: false,
      isFetchingNextPage: false,
      offset: 0,
      moreToFetch: true,
      isVoteRequestInFlight: false,
      loggedInUserSubmission: null
    });
  },

  requestCurrentChallenge: function(callback) {
    var that = this;

    this.set({
      isLoadingCurrentChallenge: true
    });

    AjaxUtils.ajax(
      '/campusChallenge/getCurrentForNetwork',
      {
        networkName: userLoginMetadataStore.getNetworkName(),
        userEmail: userLoginMetadataStore.getEmail()
      },
      (res) => {
        that.set({
          currentChallenge: res.body.challenge,
          noCurrentChallenge: res.body.isChallengeEmpty,
          isLoadingCurrentChallenge: false
        });
        if (callback) {
          callback();
        }
      },
      () => {
        that.set({
          isLoadingCurrentChallenge: false
        });
      }
    );
  },

  fetchSubmissions: function(shouldRecurse) {
    if (!this.getCurrentChallenge().id) {
      return;
    }
    
    var that = this,
        currentOffset = this.get('offset'),
        currentSubmissions;

    if (currentOffset === 0) {
      this.set({
        isFetchingFirstPage: true
      });
    }
    else {
      this.set({
        isFetchingNextPage: true
      });
    }

    currentSubmissions = this.getSubmissions();
    AjaxUtils.ajax(
      '/campusChallenge/fetchRecentSubmissions',
      {
        campusChallengeIdString: this.getCurrentChallenge().id,
        userEmail: userLoginMetadataStore.getEmail(),
        fetchOffset: currentOffset,
        maxToFetch: MAX_SUBMISSIONS_PER_PAGE
      },
      (res) => {
        that.set({
          submissions: currentSubmissions.concat(res.body.submissions),
          moreToFetch: res.body.moreToFetch,
          offset: currentOffset + MAX_SUBMISSIONS_PER_PAGE,
          isFetchingFirstPage: false,
          isFetchingNextPage: false
        });

        if (shouldRecurse) {
          this.fetchSubmissions();
        }
      },
      () => {
        that.set({
          isFetchingFirstPage: false,
          isFetchingNextPage: false
        });
      }
    );
  },
  
  upVoteSubmission: function(submissionId, callback) {
    var that = this;

    if (this.get('isVoteRequestInFlight')) {
      return;
    }
    
    //optimistically up vote submission
    this.set({
      submissions: CampusChallengeUtils.upVoteSubmissionFromList(this.getSubmissions(), submissionId),
      isVoteRequestInFlight: true
    });
    if (callback) {
      callback();
    }

    AjaxUtils.ajax(
      '/campusChallenge/upVoteSubmission',
      {
        campusChallengeSubmissionIdString: submissionId,
        userEmail: userLoginMetadataStore.getEmail()
      },
      (res) => {
        that.set({
          isVoteRequestInFlight: false
        });
      },
      () => {
        that.set({
          isVoteRequestInFlight: false
        });
      }
    );
  },

  removeUpVoteForSubmission: function(submissionId, callback) {
    var that = this;

    if (this.get('isVoteRequestInFlight')) {
      return;
    }

    //optimistically remove up vote on submission
    this.set({
      submissions: CampusChallengeUtils.removeUpVoteOnSubmissionFromList(this.getSubmissions(), submissionId),
      isVoteRequestInFlight: true
    });
    if (callback) {
      callback();
    }

    AjaxUtils.ajax(
      '/campusChallenge/removeUpVoteSubmission',
      {
        campusChallengeSubmissionIdString: submissionId,
        userEmail: userLoginMetadataStore.getEmail()
      },
      (res) => {
        that.set({
          isVoteRequestInFlight: false
        });
      },
      () => {
        that.set({
          isVoteRequestInFlight: false
        });
      }
    );
  },

  submitComment: function(comment, post, callback) {
    var that = this,
        commenterName = userLoginMetadataStore.getFullName(),
        commenterProfileImage = userLoginMetadataStore.getProfileImageUrl();

    if (!comment) {
      return;
    }

    AjaxUtils.ajax(
      '/post/createComment',
      {
        postIdString: post.postIdString,
        userIdString: userLoginMetadataStore.getUserId(),
        comment: comment
      },
      (res) => {
        let submissions = that.getSubmissions();
        let submissionForPost = CampusChallengeUtils.getSubmissionByPostId(submissions, post.postIdString);
        submissionForPost.postJson = PostUtils.addComment(post, comment, commenterName, commenterProfileImage, res.body.commentId);

        that.set({
          submissions: submissions
        });
        callback(comment, res.body.commentId);
      },
      () => {

      }
    );
  },

  deleteComment: function(comment, post, callback) {
    var that = this;

    AjaxUtils.ajax(
      '/post/deleteComment',
      {
        commentIdString: comment.id,
        userIdString: userLoginMetadataStore.getUserId()
      },
      (res) => {
        let submissions = that.getSubmissions();
        let submissionForPost = CampusChallengeUtils.getSubmissionByPostId(submissions, post.postIdString);
        submissionForPost.postJson = PostUtils.deleteComment(post, res.body.firstComments);

        that.set({
          submissions: submissions
        });
        callback();
      },
      () => {

      }
    );
  },
  
  requestLoggedInUserSubmission: function() {
    var that = this,
        campusChallengeId = this.getCurrentChallenge().id;

    if (!campusChallengeId) {
      return;
    }

    // reset as if it has no value.  Null is meaningful!
    this.set({
      loggedInUserSubmission: null
    });

    AjaxUtils.ajax(
      '/campusChallenge/getSubmissionForUser',
      {
        campusChallengeIdString: campusChallengeId,
        userEmail: userLoginMetadataStore.getEmail()
      },
      (res) => {
        that.set({
          loggedInUserSubmission: res.body.submission
        });
      },
      () => {
        
      }
    );
  },

  isLoadingCurrentChallenge: function() {
    return this.get('isLoadingCurrentChallenge');
  },

  isFetchingFirstPage: function() {
    return this.get('isFetchingFirstPage');
  },

  isFetchingNextPage: function() {
    return this.get('isFetchingNextPage');
  },

  getCurrentChallenge: function() {
    let currChallenge = this.get('currentChallenge');
    return currChallenge ? currChallenge.toJSON() : null;
  },

  getNoCurrentChallenge: function() {
    return this.get('noCurrentChallenge');
  },
  
  getSubmissions: function() {
    let currSubmissions = this.get('submissions');
    return currSubmissions ? currSubmissions.toJSON() : null;
  },

  getMoreToFetch: function() {
    return this.get('moreToFetch');
  },
  
  getLoggedInUserSubmission: function() {
    let sub = this.get('loggedInUserSubmission');
    return sub ? sub.toJSON() : null;
  },
  
  hasLoggedInUserEntered: function() {
    let sub = this.getLoggedInUserSubmission();
    if (sub === null) {
      return null; // null is meaningful to callers
    }
    
    // it can be an empty map
    return sub.id ? true : false;
  }

});

module.exports = campusChallengeStore;
