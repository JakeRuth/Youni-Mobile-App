'use strict';

var CampusChallengeUtils = {

  upVoteSubmissionFromList: function(submissions, upVotedSubmissionId) {
    let submission = submissions.find((sub) => {
      return sub.id === upVotedSubmissionId;
    });

    submission.numVotes++;
    submission.upVoted = true;

    if (submission.postJson && submission.postJson.numLikes >= 0) {
      submission.postJson.numLikes++;
      submission.postJson.liked = true;
    }
    return submissions;
  },

  removeUpVoteOnSubmissionFromList: function(submissions, removedUpVoteSubmissionId) {
    let submission = submissions.find((sub) => {
      return sub.id === removedUpVoteSubmissionId;
    });

    submission.numVotes--;
    submission.upVoted = false;

    if (submission.postJson && submission.postJson.numLikes >= 0) {
      submission.postJson.numLikes--;
      submission.postJson.liked = false;
    }
    return submissions;
  }

};

module.exports = CampusChallengeUtils;
