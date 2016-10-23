'use strict';

var React = require('react');
var ReactNative = require('react-native');
var CustomSwipeCards = require('../../CustomSwipeCards');

var Submission = require('../Submission/Submission');
var Spinner = require('../../Common/Spinner');

var Colors = require('../../../Utils/Common/Colors');
var AjaxUtils = require('../../../Utils/Common/AjaxUtils');

var campusChallengeStore = require('../../../stores/campusChallenge/CampusChallengeStore');
var userLoginMetadataStore = require('../../../stores/UserLoginMetadataStore');
var hackyNonSwipeBackablePageStore = require('../../../stores/common/HackyNonSwipeBackablePageStore');

var {
  View,
  Text,
  Image,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  helpText: {
    color: Colors.MED_GRAY,
    fontSize: 14,
    textAlign: 'center',
    paddingTop: 10
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center'
  }
});

var ChallengeSubmissionVotingCardSlider = React.createClass({

  getInitialState: function() {
    return {
      indexOfLastCardRemoved: null,
      submissions: [],
      isFirstPageLoading: true,
      isLoadingMoreCards: false,
      isVoteRequestInFlight: false, // used for upVote and noVote requests
      moreToFetch: false
    };
  },

  componentDidMount: function() {
    this.fetchSubmissionsForVoting();
  },

  render: function () {
    var content;

    if (this.state.isFirstPageLoading) {
      content = <Spinner/>;
    }
    else {
      content = this.renderSwiper();
    }

    return (
      <View style={styles.container}>
        {content}
      </View>
    );
  },

  renderSwiper: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.helpText}>
          Swipe left or right to vote! Swoooosh
        </Text>
        <CustomSwipeCards
          style={styles.cardContainer}
          cards={this.state.submissions}
          renderCard={(submission) => <Submission submission={submission}/>}
          handleYup={this.upVoteSubmission}
          handleNope={this.noVoteSubmission}
          cardRemoved={this.cardRemoved}/>
      </View>
    );
  },
  
  onVoteIndicatorPress: function(isUpVote) {
    let submissions = this.state.submissions,
      currSubmissionIndex = this.state.indexOfLastCardRemoved === null ? 0 : this.state.indexOfLastCardRemoved + 1,
      currSubmission = submissions[currSubmissionIndex];

    if (isUpVote) {
      this.upVoteSubmission(currSubmission);
    }
    else {
      this.noVoteSubmission(currSubmission);
    }

    submissions.splice(currSubmissionIndex, 1);
    this.setState({
      submissions: submissions
    }, this.ifNoMoreSubmissionsCloseSliderOrGetMore);
  },

  cardRemoved: function() {
    let newRemovedCardIndex,
        currentRemovedCardIndex = this.state.indexOfLastCardRemoved;

    if (currentRemovedCardIndex === null) {
      newRemovedCardIndex = 0;
    }
    else {
      newRemovedCardIndex = currentRemovedCardIndex + 1;
    }

    this.setState({
      indexOfLastCardRemoved: newRemovedCardIndex
    }, this.ifNoMoreSubmissionsCloseSliderOrGetMore);
  },

  ifNoMoreSubmissionsCloseSliderOrGetMore: function() {
    let isLastSubmissionInArray = this.state.indexOfLastCardRemoved >= this.state.submissions.length - 1;
    if (isLastSubmissionInArray) {
      if (this.state.moreToFetch) {
        this.fetchSubmissionsForVoting();
      }
      else {
        hackyNonSwipeBackablePageStore.hidePage();
      }
    }
  },

  fetchSubmissionsForVoting: function() {
    var that = this;

    this._hackilyWaitForVoteRequestsToFinishIfPresent(() => {
      AjaxUtils.ajax(
        '/campusChallenge/fetchSubmissionsToVote',
        {
          campusChallengeIdString: campusChallengeStore.getCurrentChallenge().id,
          userEmail: userLoginMetadataStore.getEmail()
        },
        (res) => {
          that.setState({
            submissions: that.state.submissions.concat(res.body.submissions),
            moreToFetch: res.body.moreToFetch,
            isFirstPageLoading: false,
            isLoadingMoreCards: false
          });

          // edge case, this is normally handled in cardRemoved function, but when the numbers of submissions to vote
          // on is a multiple of the page size, then the API will return an incorrect moreToFetch=true
          if (res.body.submissions.length === 0) {
            hackyNonSwipeBackablePageStore.hidePage();
          }
        },
        () => {
          that.setState({
            isFirstPageLoading: false,
            isLoadingMoreCards: false
          });
        }
      );
    });
  },

  upVoteSubmission: function(submission) {
    var that = this;

    this.setState({
      isVoteRequestInFlight: true
    });

    AjaxUtils.ajax(
      '/campusChallenge/upVoteSubmission',
      {
        campusChallengeSubmissionIdString: submission.id,
        userEmail: userLoginMetadataStore.getEmail()
      },
      (res) => {
        console.log('up: ',res)
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

  noVoteSubmission: function(submission) {
    var that = this;

    this.setState({
      isVoteRequestInFlight: true
    });

    AjaxUtils.ajax(
      '/campusChallenge/markSubmissionAsSeen',
      {
        campusChallengeSubmissionIdString: submission.id,
        userEmail: userLoginMetadataStore.getEmail()
      },
      (res) => {
        console.log('no: ',res)
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

  _hackilyWaitForVoteRequestsToFinishIfPresent: function(request) {
    if (!this.state.isVoteRequestInFlight) {
      request();
      return;
    }
    let timer;

    // every quarter second check to see if
    timer = setInterval(() => {
      if (!this.state.isVoteRequestInFlight) {
        request();
        clearInterval(timer);
      }
    }, 250);
  }

});

module.exports = ChallengeSubmissionVotingCardSlider;
