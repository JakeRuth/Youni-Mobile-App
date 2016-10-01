'use strict';

var CampusChallengeUtils = {

  upVoteSubmissionFromList: function(submissions, upVotedSubmissionId) {
    let submission = submissions.find((sub) => {
      return sub.id === upVotedSubmissionId;
    });

    this.upVoteSubmission(submission);
    return submissions;
  },

  removeUpVoteOnSubmissionFromList: function(submissions, removedUpVoteSubmissionId) {
    let submission = submissions.find((sub) => {
      return sub.id === removedUpVoteSubmissionId;
    });

    this.removeUpVoteOnSubmission(submission);
    return submissions;
  },

  upVoteSubmission: function(submission) {
    submission.numVotes++;
    submission.upVoted = true;

    if (submission.postJson && submission.postJson.numLikes >= 0) {
      submission.postJson.numLikes++;
      submission.postJson.liked = true;
    }
    return submission;
  },

  removeUpVoteOnSubmission: function(submission) {
    submission.numVotes--;
    submission.upVoted = false;

    if (submission.postJson && submission.postJson.numLikes >= 0) {
      submission.postJson.numLikes--;
      submission.postJson.liked = false;
    }
    return submission;
  },
  
  getSubmissionByPostId: function(submissions, postId) {
    return submissions.find((sub) => {
      if (sub.postJson && sub.postJson.postIdString) {
        return sub.postJson.postIdString === postId;
      }
    });
  },
  
  getTimeTextForChallenge: function(challenge) {
    if (challenge.winningSubmissions && challenge.winningSubmissions.length) {
      return challenge.endDate;
    }
    else {
      let {
        daysRemaining,
        hoursRemaining,
        minutesRemaining,
        secondsRemaining
      } = challenge;
      let message = '';

      if (daysRemaining) {
        message += `${daysRemaining}d `;
      }
      if (daysRemaining || hoursRemaining > 0) {
        message += `${hoursRemaining}h `;
      }
      if (daysRemaining || hoursRemaining || minutesRemaining > 0) {
        message += `${minutesRemaining}m`;
      }

      //edge case
      if (!daysRemaining && !hoursRemaining && !minutesRemaining) {
        message = `${secondsRemaining}s`;
      }

      return message;
    }
  }

};

module.exports = CampusChallengeUtils;
