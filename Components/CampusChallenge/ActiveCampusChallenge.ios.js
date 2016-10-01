'use strict';

var React = require('react');
var ReactNative = require('react-native');

var PastChallengesBanner = require('./PastChallengesBanner');
var ChallengeCoverPhoto = require('./ChallengeCoverPhoto');
var ChallengeActionButton = require('./ChallengeActionButton');
var SubmissionPostViewControls = require('./SubmissionPostViewControls');
var SubmissionList = require('./Submission/SubmissionList');
var Spinner = require('../Common/Spinner');
var EmptyResults = require('../Common/EmptyResults');

var Colors = require('../../Utils/Common/Colors');
var CampusChallengeUtils = require('../../Utils/CampusChallenge/CampusChallengeUtils');
var PostViewType = require('../../Utils/Enums/PostViewType');
var campusChallengeStore = require('../../stores/campusChallenge/CampusChallengeStore');

var {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1
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
  },
  challengeActionButtonContainer: {
    position: 'absolute',
    left: 0,
    bottom: 35
  }
});

var ActiveCampusChallenge = React.createClass({

  propTypes: {
    challenge: React.PropTypes.object.isRequired,
    challengeSubmissions: React.PropTypes.array,
    handleScroll: React.PropTypes.func.isRequired,
    navigator: React.PropTypes.object.isRequired
  },
  
  getInitialState: function() {
    return {
      postViewMode: PostViewType.GRID
    };
  },

  render: function() {
    var postsElement;

    if (this.props.challengeSubmissions && this.props.challengeSubmissions.length) {
      postsElement = (
        <SubmissionList
          style={{marginBottom: 60}}
          submissions={this.props.challengeSubmissions}
          onLoadMoreSubmissionsPress={() => campusChallengeStore.fetchSubmissions(true)}
          isNextPageLoading={campusChallengeStore.isFetchingNextPage()}
          noMoreSubmissionsToFetch={!campusChallengeStore.getMoreToFetch()}
          gridViewEnabled={this.state.postViewMode === PostViewType.GRID}
          upVoteAction={(submissionId, callback) => campusChallengeStore.upVoteSubmission(submissionId, callback)}
          removeUpVoteAction={(submissionId, callback) => campusChallengeStore.removeUpVoteForSubmission(submissionId, callback)}
          onSubmitCommentAction={campusChallengeStore.submitComment}
          onDeleteCommentAction={campusChallengeStore.deleteComment}
          loadMoreButtonStyle={{
            marginBottom: 40
          }}
          navigator={this.props.navigator}/>
      );
    }
    else if (campusChallengeStore.isFetchingFirstPage()) {
      postsElement = <Spinner/>;
    }
    else {
      postsElement = (
        <EmptyResults
          textStyle={{marginTop: 20}}
          message="No submissions yet"/>
      );
    }

    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          automaticallyAdjustContentInsets={false}
          onScroll={this.props.handleScroll}>

          <PastChallengesBanner navigator={this.props.navigator}/>

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

          {postsElement}

        </ScrollView>

        <View style={styles.challengeActionButtonContainer}>
          <ChallengeActionButton navigator={this.props.navigator}/>
        </View>
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
  }

});

module.exports = ActiveCampusChallenge;
