'use strict';

var React = require('react');
var ReactNative = require('react-native');

var Submission = require('../CampusChallenge/Submission/Submission');
var YouniHeader = require('../Common/YouniHeader');
var BackArrow = require('../Common/BackArrow');

var Colors = require('../../Utils/Common/Colors');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var PostUtils = require('../../Utils/Post/PostUtils');
var LogoImageSize = require('../../Utils/Enums/LogoImageSize');
var CampusChallengeUtils = require('../../Utils/CampusChallenge/CampusChallengeUtils');

var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  pageHeader: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    marginTop: -12,
    width: LogoImageSize.WIDTH * .1,
    height: LogoImageSize.HEIGHT * .1
  }
});

var CampusChallengeSubmissionPopup = React.createClass({

  propTypes: {
    submission: React.PropTypes.object.isRequired,
    onSubmitCommentAction: React.PropTypes.func,
    onDeleteCommentAction: React.PropTypes.func,
    upVoteAction: React.PropTypes.func,
    removeUpVoteAction: React.PropTypes.func,
    navigator: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      submission: this.props.submission,
      isVoteRequestInFlight: false // used to prevent API call spam (from rapid user tapping)
    };
  },

  render: function () {
    return (
      <View style={styles.container}>

        <YouniHeader style={[styles.pageHeader, {backgroundColor: Colors.getPrimaryAppColor()}]}>
          <Image
            style={styles.logo}
            source={require('../../images/logoWhiteTextBlankBackground.png')}/>
          <BackArrow
            onPress={() => this.props.navigator.pop()}
            color="white"/>
        </YouniHeader>

        <ScrollView automaticallyAdjustContentInsets={false}>
          <Submission
            {...this.props}
            submission={this.state.submission}
            upVoteAction={this.props.upVoteAction ? this.upVoteAction : this._upVote}
            removeUpVoteAction={this.props.removeUpVoteAction ? this.removeUpVoteAction : this._removeUpVote}
            onSubmitCommentAction={this.props.onSubmitCommentAction ? this.props.onSubmitCommentAction : this._submitComment}
            onDeleteCommentAction={this.props.onDeleteCommentAction ? this.props.onDeleteCommentAction : this._deleteComment}/>
        </ScrollView>

      </View>
    );
  },

  //these functions are wrapped because the view is not being updated from the campus challenge store event changes
  upVoteAction: function() {
    this.props.upVoteAction(this.state.submission.id, () => {
      this.setState({
        submission: CampusChallengeUtils.upVoteSubmission(this.state.submission)
      });
    });
    this.forceUpdate();
  },

  removeUpVoteAction: function() {
    this.props.removeUpVoteAction(this.state.submission.id, () => {
      this.setState({
        submission: CampusChallengeUtils.removeUpVoteOnSubmission(this.state.submission)
      });
    });
    this.forceUpdate();
  },

  _upVote: function() {
    var that = this;

    if (this.state.isVoteRequestInFlight) {
      return;
    }

    //optimistically up vote submission
    this.setState({
      submission: CampusChallengeUtils.upVoteSubmission(this.state.submission),
      isVoteRequestInFlight: true
    });

    AjaxUtils.ajax(
      '/campusChallenge/upVoteSubmission',
      {
        campusChallengeSubmissionIdString: this.state.submission.id,
        userEmail: userLoginMetadataStore.getEmail()
      },
      (res) => {
        that.setState({
          isVoteRequestInFlight: false
        });
      },
      () => {
        that.setState({
          isVoteRequestInFlight: false
        });
      }
    );
  },

  _removeUpVote: function() {
    var that = this;

    if (this.state.isVoteRequestInFlight) {
      return;
    }

    //optimistically remove up vote on submission
    this.setState({
      submission: CampusChallengeUtils.removeUpVoteOnSubmission(this.state.submission),
      isVoteRequestInFlight: true
    });

    AjaxUtils.ajax(
      '/campusChallenge/removeUpVoteSubmission',
      {
        campusChallengeSubmissionIdString: this.state.submission.id,
        userEmail: userLoginMetadataStore.getEmail()
      },
      (res) => {
        that.setState({
          isVoteRequestInFlight: false
        });
      },
      () => {
        that.setState({
          isVoteRequestInFlight: false
        });
      }
    );
  },

  _submitComment: function(comment, post, callback) {
    if (this.state.submission.isAnonymous) {
      return;
    }

    var that = this,
        currSubmission = this.state.submission,
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
        currSubmission.postJson = PostUtils.addComment(post, comment, commenterName, commenterProfileImage, res.body.commentId);
        that.setState({
          submission: currSubmission
        });
        callback(comment, res.body.commentId);
      },
      () => {

      }
    );
  },

  _deleteComment: function(comment, post, callback) {
    if (this.state.submission.isAnonymous) {
      return;
    }

    var that = this,
        currSubmission = this.state.submission;

    AjaxUtils.ajax(
      '/post/deleteComment',
      {
        commentIdString: comment.id,
        userIdString: userLoginMetadataStore.getUserId()
      },
      (res) => {
        currSubmission.postJson = PostUtils.deleteComment(post, res.body.firstComments);
        that.setState({
          submission: currSubmission
        });
        callback();
      },
      () => {

      }
    );
  }

});

module.exports = CampusChallengeSubmissionPopup;
