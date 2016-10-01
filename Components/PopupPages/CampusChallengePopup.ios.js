'use strict';

var React = require('react');
var ReactNative = require('react-native');

var ChallengeCoverPhoto = require('../CampusChallenge/ChallengeCoverPhoto');
var ChallengeActionButton = require('../CampusChallenge/ChallengeActionButton');
var SubmissionPostViewControls = require('../CampusChallenge/SubmissionPostViewControls');
var SubmissionList = require('../CampusChallenge/Submission/SubmissionList');
var YouniHeader = require('../Common/YouniHeader');
var BackArrow = require('../Common/BackArrow');
var Spinner = require('../Common/Spinner');
var EmptyResults = require('../Common/EmptyResults');

var Colors = require('../../Utils/Common/Colors');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var PostViewType = require('../../Utils/Enums/PostViewType');
var CampusChallengeUtils = require('../../Utils/CampusChallenge/CampusChallengeUtils');
var PostUtils = require('../../Utils/Post/PostUtils');

var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var {
  View,
  Text,
  ScrollView,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  pageHeaderLabel: {
    fontSize: 20,
    fontWeight: '500',
    color: 'white',
    textAlign: 'center'
  },
  endTime: {
    fontSize: 18,
    textAlign: 'center'
  },
  prizeMessage: {
    color: Colors.MED_GRAY,
    fontWeight: '500',
    fontSize: 16,
    textAlign: 'center',
    paddingBottom: 5
  }
});

var CampusChallengePopup = React.createClass({

  PAGE_SIZE: 40,

  propTypes: {
    challenge: React.PropTypes.object.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      submissions: [],
      offset: 0,
      moreToFetch: true,
      loadingInitialSubmissionsPage: false,
      loadingNextPageOfSubmissions: false,
      voteRequestInFlight: false, // used to prevent rapid user tapping from spamming the API
      postViewMode: PostViewType.GRID
    };
  },

  componentDidMount: function() {
    this.fetchSubmissions(true);
  },

  render: function () {
    var submissionsElement;

    if (this.state.submissions.length) {
      submissionsElement = (
        <SubmissionList
          submissions={this.state.submissions}
          winningSubmissions={this.props.challenge.winningSubmissions}
          onLoadMoreSubmissionsPress={() => this.fetchSubmissions(true)}
          isNextPageLoading={this.state.loadingNextPageOfSubmissions}
          noMoreSubmissionsToFetch={!this.state.moreToFetch}
          gridViewEnabled={this.state.postViewMode === PostViewType.GRID}
          upVoteAction={(submissionId) => this.upVoteSubmission(submissionId)}
          removeUpVoteAction={(submissionId) => this.removeUpVoteForSubmission(submissionId)}
          onSubmitCommentAction={this.submitComment}
          onDeleteCommentAction={this.deleteComment}
          loadMoreButtonStyle={{
            marginBottom: 40
          }}
          navigator={this.props.navigator}/>
      );
    }
    else if (this.state.loadingInitialSubmissionsPage) {
      submissionsElement = <Spinner/>;
    }
    else {
      submissionsElement = (
        <EmptyResults
          textStyle={{marginTop: 20}}
          message="No submissions"/>
      );
    }

    return (
      <View style={styles.container}>

        <YouniHeader style={{backgroundColor: Colors.getPrimaryAppColor()}}>
          <Text style={styles.pageHeaderLabel}>
            Campus Challenge
          </Text>
          <BackArrow
            color="white"
            onPress={() => this.props.navigator.pop()}/>
        </YouniHeader>

        <ScrollView
          style={styles.container}
          automaticallyAdjustContentInsets={false}>

          <ChallengeCoverPhoto
            name={this.props.challenge.name}
            description={this.props.challenge.description}
            photoUrl={this.props.challenge.coverPhotoUrl}/>

          <SubmissionPostViewControls
            currentPostViewMode={this.state.postViewMode}
            onPostViewControlPress={this._togglePostViewMode}>
            <Text style={[styles.endTime, { color: Colors.getPrimaryAppColor() }]}>
              {CampusChallengeUtils.getTimeTextForChallenge(this.props.challenge)}
            </Text>
          </SubmissionPostViewControls>

          <Text style={styles.prizeMessage}>
            {this.props.challenge.prizes[0]}
          </Text>

          {submissionsElement}

        </ScrollView>

      </View>
    );
  },

  _togglePostViewMode: function() {
    if (this.state.postViewMode === PostViewType.GRID) {
      this.setState({
        postViewMode: PostViewType.LIST
      });
    }
    else {
      this.setState({
        postViewMode: PostViewType.GRID
      });
    }
  },

  fetchSubmissions: function(shouldRecurse) {
    var that = this,
        currentOffset = this.state.offset,
        currentSubmissions;

    if (currentOffset === 0) {
      this.setState({
        loadingInitialSubmissionsPage: true,
        submissions: []
      });
    }
    else {
      this.setState({
        loadingNextPageOfSubmissions: true
      });
    }

    currentSubmissions = this.state.submissions;
    AjaxUtils.ajax(
      '/campusChallenge/fetchTopSubmissions',
      {
        campusChallengeIdString: this.props.challenge.id,
        userEmail: userLoginMetadataStore.getEmail(),
        fetchOffset: currentOffset,
        maxToFetch: this.PAGE_SIZE
      },
      (res) => {
        that.setState({
          submissions: currentSubmissions.concat(res.body.submissions),
          moreToFetch: res.body.moreToFetch,
          offset: currentOffset + that.PAGE_SIZE,
          loadingInitialSubmissionsPage: false,
          loadingNextPageOfSubmissions: false
        });

        if (shouldRecurse) {
          this.fetchSubmissions();
        }
      },
      () => {
        that.setState({
          loadingInitialSubmissionsPage: false,
          loadingNextPageOfSubmissions: false
        });
      }
    );
  },

  upVoteSubmission: function(submissionId) {
    var that = this;

    if (this.state.voteRequestInFlight) {
      return;
    }

    //optimistically up vote submission
    this.setState({
      submissions: CampusChallengeUtils.upVoteSubmissionFromList(this.state.submissions, submissionId),
      voteRequestInFlight: true
    });

    AjaxUtils.ajax(
      '/campusChallenge/upVoteSubmission',
      {
        campusChallengeSubmissionIdString: submissionId,
        userEmail: userLoginMetadataStore.getEmail()
      },
      (res) => {
        that.setState({
          voteRequestInFlight: false
        });
      },
      () => {
        that.setState({
          voteRequestInFlight: false
        });
      }
    );
  },

  removeUpVoteForSubmission: function(submissionId) {
    var that = this;

    if (this.state.voteRequestInFlight) {
      return;
    }

    //optimistically remove up vote on submission
    this.setState({
      submissions: CampusChallengeUtils.removeUpVoteOnSubmissionFromList(this.state.submissions, submissionId),
      voteRequestInFlight: true
    });

    AjaxUtils.ajax(
      '/campusChallenge/removeUpVoteSubmission',
      {
        campusChallengeSubmissionIdString: submissionId,
        userEmail: userLoginMetadataStore.getEmail()
      },
      (res) => {
        that.setState({
          voteRequestInFlight: false
        });
      },
      () => {
        that.setState({
          voteRequestInFlight: false
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
        let submissions = that.state.submissions;
        let submissionForPost = CampusChallengeUtils.getSubmissionByPostId(submissions, post.postIdString);
        submissionForPost.postJson = PostUtils.addComment(post, comment, commenterName, commenterProfileImage, res.body.commentId);

        that.setState({
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
        let submissions = that.state.submissions;
        let submissionForPost = CampusChallengeUtils.getSubmissionByPostId(submissions, post.postIdString);
        submissionForPost.postJson = PostUtils.deleteComment(post, res.body.firstComments);

        that.setState({
          submissions: submissions
        });
        callback();
      },
      () => {

      }
    );
  }

});

module.exports = CampusChallengePopup;
