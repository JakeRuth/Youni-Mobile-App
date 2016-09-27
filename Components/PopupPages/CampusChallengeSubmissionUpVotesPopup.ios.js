'use strict';

var React = require('react');
var ReactNative = require('react-native');

var LikesList = require('../Post/Footer/Like/LikesList');
var YouniHeader = require('../Common/YouniHeader');
var Spinner = require('../Common/Spinner');
var BackArrow = require('../Common/BackArrow');

var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var Colors = require('../../Utils/Common/Colors');
var UserUtils = require('../../Utils/User/UserUtils');

var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var {
  View,
  Text,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  pageHeader: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center'
  },
  spinnerContainer: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center'
  }
});

var CampusChallengeSubmissionUpVotesPopup = React.createClass({

  PAGE_SIZE: 50,

  propTypes: {
    navigator: React.PropTypes.object.isRequired,
    submissionId: React.PropTypes.string.isRequired
  },

  getInitialState: function() {
    return {
      upVoteUsers: [],
      isInitialPageLoading: true,
      isLoadingMore: false,
      moreToFetch: false,
      offset: 0
    };
  },

  componentDidMount() {
    this._fetchUpVoteUsers();
  },

  render: function () {
    var pageContent;

    if (this.state.isInitialPageLoading) {
      pageContent = (
        <View style={styles.spinnerContainer}>
          <Spinner/>
        </View>
      );
    }
    else {
      pageContent = (
        <LikesList
          isLoadingMoreUsers={this.state.isLoadingMore}
          moreToFetch={this.state.moreToFetch}
          onLoadMorePress={this._fetchUpVoteUsers}
          users={this.state.upVoteUsers}
          navigator={this.props.navigator}/>
      );
    }

    return (
      <View style={styles.container}>

        <YouniHeader>
          <Text style={[styles.pageHeader, { color: Colors.getPrimaryAppColor() }]}>
            Up Votes
          </Text>
          <BackArrow onPress={() => this.props.navigator.pop()}/>
        </YouniHeader>

        {pageContent}

      </View>
    );
  },

  _fetchUpVoteUsers: function() {
    var that = this,
        currentUpVoteUsers = this.state.upVoteUsers;

    if (this.state.offset === 0) {
      this.setState({
        isInitialPageLoading: true
      });
    }
    else {
      this.setState({
        isLoadingMore: true
      });
    }

    AjaxUtils.ajax(
      '/campusChallenge/fetchUpVotesForSubmission',
      {
        campusChallengeSubmissionIdString: this.props.submissionId,
        userEmail: userLoginMetadataStore.getEmail(),
        fetchOffset: that.state.offset,
        maxToFetch: that.PAGE_SIZE
      },
      (res) => {
        var upVoteUsers = UserUtils.convertResponseUserListToMap(res.body.users);

        that.setState({
          upVoteUsers: currentUpVoteUsers.concat(upVoteUsers),
          moreToFetch: res.body.moreToFetch,
          offset: that.state.offset + that.PAGE_SIZE,
          isInitialPageLoading: false,
          isLoadingMore: false
        });
      },
      () => {
        that.setState({
          isInitialPageLoading: false,
          isLoadingMore: false
        });
      }
    );
  }

});

module.exports = CampusChallengeSubmissionUpVotesPopup;
