'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');

var SubmissionList = require('../CampusChallenge/Submission/SubmissionList');
var YouniHeader = require('../Common/YouniHeader');
var BackArrow = require('../Common/BackArrow');
var Spinner = require('../Common/Spinner');
var EmptyResults = require('../Common/EmptyResults');

var Colors = require('../../Utils/Common/Colors');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var {
  View,
  Text,
  AlertIOS,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  pageHeader: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center'
  },
  helpIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingTop: 29,
    paddingRight: 12,
    paddingLeft: 30,
    paddingBottom: 15,
    backgroundColor: 'transparent'
  }
});

var AllCampusChallengeSubmissionsPopup = React.createClass({

  PAGE_SIZE: 50,

  propTypes: {
    campusChallenge: React.PropTypes.object.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      submissions: [],
      isFetchingFirstPage: false,
      isFetchingNextPage: false,
      offset: 0,
      moreToFetch: false
    };
  },

  componentDidMount: function() {
    this.fetchSubmissions(true);
  },

  render: function () {
    var content;

    if (this.state.isFetchingFirstPage) {
      content = <Spinner/>;
    }
    else if (!this.state.submissions.length && !this.state.isFetchingNextPage) {
      content = <EmptyResults message="No Submissions"/>;
    }
    else {
      content = (
        <SubmissionList
          submissions={this.state.submissions}
          onLoadMoreSubmissionsPress={() => this.fetchSubmissions(true)}
          isNextPageLoading={this.state.isFetchingNextPage}
          noMoreSubmissionsToFetch={!this.state.moreToFetch}
          gridViewEnabled={true}
          navigator={this.props.navigator}/>
      );
    }

    return (
      <View style={styles.container}>

        <YouniHeader style={{backgroundColor: Colors.getPrimaryAppColor()}}>
          <Text style={styles.pageHeader}>
            All Submissions
          </Text>
          <BackArrow
            color="white"
            onPress={() => this.props.navigator.pop()}/>
          <Icon
            style={styles.helpIcon}
            onPress={this.onHelpIconPress}
            name='help'
            size={25}
            color="white"/>
        </YouniHeader>

        {content}

      </View>
    );
  },

  fetchSubmissions: function(shouldRecurse) {
    var that = this,
        currentOffset = this.state.offset,
        currentSubmissions = this.state.submissions;

    if (currentOffset === 0) {
      this.setState({
        isFetchingFirstPage: true
      });
    }
    else {
      this.setState({
        isFetchingNextPage: true
      });
    }

    AjaxUtils.ajax(
      '/campusChallenge/fetchTopSubmissions',
      {
        campusChallengeIdString: this.props.campusChallenge.id,
        userEmail: userLoginMetadataStore.getEmail(),
        fetchOffset: currentOffset,
        maxToFetch: this.PAGE_SIZE
      },
      (res) => {
        that.setState({
          submissions: currentSubmissions.concat(res.body.submissions),
          moreToFetch: res.body.moreToFetch,
          offset: currentOffset + that.PAGE_SIZE,
          isFetchingFirstPage: false,
          isFetchingNextPage: false
        });

        if (shouldRecurse) {
          this.fetchSubmissions();
        }
      },
      () => {
        that.setState({
          isFetchingFirstPage: false,
          isFetchingNextPage: false
        });
      }
    );
  },

  onHelpIconPress: function() {
    AlertIOS.alert(
      this.props.campusChallenge.name,
      this.props.campusChallenge.description,
      [
        {
          text: 'Okay'
        }
      ]
    );
  }

});

module.exports = AllCampusChallengeSubmissionsPopup;
