'use strict';

var Unicycle = require('../../Unicycle');

var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var CampusChallengeUtils = require('../../Utils/CampusChallenge/CampusChallengeUtils');
var userLoginMetadataStore = require('../UserLoginMetadataStore');

var MAX_SUBMISSIONS_PER_PAGE = 40;

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
      isVoteRequestInFlight: false
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
        currentSubmissions = this.getSubmissions();

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
  }

});

module.exports = campusChallengeStore;
