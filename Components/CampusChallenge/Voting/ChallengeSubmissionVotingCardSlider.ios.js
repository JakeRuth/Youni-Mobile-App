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

var THRESHOLD_TO_FETCH_MORE_CARDS = 5;

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
      submissions: [],
      isFirstPageLoading: true,
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

  cardRemoved: function(indexOfCardRemoved) {
    let newRemovedCardIndex;

    if (indexOfCardRemoved === null) {
      newRemovedCardIndex = 0;
    }
    else {
      newRemovedCardIndex = indexOfCardRemoved + 1;
    }

    this.ifNoMoreSubmissionsCloseSliderOrGetMore(indexOfCardRemoved);
  },

  ifNoMoreSubmissionsCloseSliderOrGetMore: function(indexOfCardRemoved) {
    let shouldFetchMoreSubmissions = indexOfCardRemoved >= this.state.submissions.length - THRESHOLD_TO_FETCH_MORE_CARDS;
    if (shouldFetchMoreSubmissions && this.state.moreToFetch) {
      this.fetchSubmissionsForVoting();
    }
    else if (!this.state.moreToFetch && indexOfCardRemoved === this.state.submissions.length - 1) {
      hackyNonSwipeBackablePageStore.hidePage();
    }
  },

  fetchSubmissionsForVoting: function() {
    var that = this,
        fetchSkipAmount;

    // is this request for the first page
    if (this.state.isFirstPageLoading) {
      fetchSkipAmount = 0;
    }
    else {
      fetchSkipAmount = THRESHOLD_TO_FETCH_MORE_CARDS - 1;
    }

    AjaxUtils.ajax(
      '/campusChallenge/fetchSubmissionsToVote',
      {
        campusChallengeIdString: campusChallengeStore.getCurrentChallenge().id,
        userEmail: userLoginMetadataStore.getEmail(),
        offsetSkipAmount: fetchSkipAmount
      },
      (res) => {
        that.setState({
          submissions: that.mergeSubmissionArrays(that.state.submissions, res.body.submissions),
          moreToFetch: res.body.moreToFetch,
          isFirstPageLoading: false
        });

        // edge case, this is normally handled in cardRemoved function, but when the numbers of submissions to vote
        // on is a multiple of the page size, then the API will return an incorrect moreToFetch=true
        if (res.body.submissions.length === 0) {
          hackyNonSwipeBackablePageStore.hidePage();
        }
      },
      () => {
        that.setState({
          isFirstPageLoading: false
        });
      }
    );
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

  mergeSubmissionArrays: function(arr1, arr2) {
    var mergedArray = arr1,
        currentSubmissionIds = arr1.map((it) => {
          return it.id;
        });

    for (var i = 0; i < arr2.length; i ++) {
      if (currentSubmissionIds.indexOf(arr2[i].id) === -1) {
        mergedArray.push(arr2[i]);
      }
      else {
        console.log('removed a duplicate!');
      }
    }
    return mergedArray
  }

});

module.exports = ChallengeSubmissionVotingCardSlider;
