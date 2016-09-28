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
      hasLoggedInUserEnteredChallenge: null
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
      hasLoggedInUserEnteredChallenge: null
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
    if (!this.getCurrentChallenge()) {
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
  
  upVoteSubmission: function(submissionId) {
    var that = this;

    if (this.get('isVoteRequestInFlight')) {
      return;
    }
    
    //optimistically up vote submission
    this.set({
      submissions: CampusChallengeUtils.upVoteSubmissionFromList(this.getSubmissions(), submissionId),
      isVoteRequestInFlight: true
    });

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

  removeUpVoteForSubmission: function(submissionId) {
    var that = this;

    if (this.get('isVoteRequestInFlight')) {
      return;
    }

    //optimistically remove up vote on submission
    this.set({
      submissions: CampusChallengeUtils.removeUpVoteOnSubmissionFromList(this.getSubmissions(), submissionId),
      isVoteRequestInFlight: true
    });

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
  
  requestHasLoggedInUserEnteredChallenge: function() {
    var that = this;

    // reset as if it has no value.  Null is meaningful!
    this.set({
      hasLoggedInUserEnteredChallenge: null
    });

    AjaxUtils.ajax(
      '/campusChallenge/hasUserEntered',
      {
        campusChallengeIdString: this.getCurrentChallenge().id,
        userEmail: userLoginMetadataStore.getEmail()
      },
      (res) => {
        that.set({
          hasLoggedInUserEnteredChallenge: res.body.userEnteredChallenge
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
  
  getHasLoggedInUserEnteredChallenge: function() {
    return this.get('hasLoggedInUserEnteredChallenge');
  }

});

module.exports = campusChallengeStore;
