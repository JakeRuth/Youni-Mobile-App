'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');
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
  cardContainer: {
    flex: 1,
    alignItems: 'center'
  },
  voteControl: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    width: 80,
    borderRadius: 40,
    shadowColor: Colors.DARK_TEXT_SHADOW,
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0
    }
  },
  noVoteControlPosition: {
    position: 'absolute',
    bottom: 22,
    left: 50
  },
  upVoteControlPosition: {
    position: 'absolute',
    bottom: 22,
    right: 50
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
        <CustomSwipeCards
          containerStyle={styles.cardContainer}
          cards={this.state.submissions}
          renderCard={(submission) => <Submission submission={submission}/>}
          yupView={this.renderUpVoteIndicator()}
          noView={this.renderNoVoteIndicator()}
          yupStyle={styles.upVoteControlPosition}
          nopeStyle={styles.noVoteControlPosition}
          handleYup={this.upVoteSubmission}
          handleNope={this.noVoteSubmission}
          cardRemoved={this.cardRemoved}
          renderNoMoreCards={() => <Spinner/>}/>
        {this._renderGhostUpVoteControl()}
        {this._renderGhostNoVoteControl()}
      </View>
    );
  },

  renderUpVoteIndicator: function() {
    return (
      <View style={styles.voteControl}>
        <Icon
          name='arrow-upward'
          size={25}
          color={Colors.getPrimaryAppColor()}/>
      </View>
    );
  },

  renderNoVoteIndicator: function() {
    return (
      <View style={styles.voteControl}>
        <Icon
          name='clear'
          size={25}
          color={Colors.LOUD_RED}/>
      </View>
    );
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

    let callback = () => {
      let isLastSubmissionInArray = this.state.indexOfLastCardRemoved >= this.state.submissions.length - 1;
      if (isLastSubmissionInArray) {
        if (this.state.moreToFetch) {
          this.fetchSubmissionsForVoting();
        }
        else {
          hackyNonSwipeBackablePageStore.hidePage();
        }
      }
    };

    this.setState({
      indexOfLastCardRemoved: newRemovedCardIndex
    }, callback);
  },

  _renderGhostUpVoteControl: function() {
    return (
      <View style={[styles.upVoteControlPosition, { opacity: .3 }]}>
        {this.renderUpVoteIndicator()}
      </View>
    );
  },

  _renderGhostNoVoteControl: function() {
    return (
      <View style={[styles.noVoteControlPosition, { opacity: .3 }]}>
        {this.renderNoVoteIndicator()}
      </View>
    );
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
