'use strict';

var React = require('react');
var ReactNative = require('react-native');

var Submission = require('../CampusChallenge/Submission/Submission');
var YouniHeader = require('../Common/YouniHeader');
var BackArrow = require('../Common/BackArrow');

var Colors = require('../../Utils/Common/Colors');
var LogoImageSize = require('../../Utils/Enums/LogoImageSize');
var CampusChallengeUtils = require('../../Utils/CampusChallenge/CampusChallengeUtils');

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
    upVoteAction: React.PropTypes.func.isRequired,
    removeUpVoteAction: React.PropTypes.func.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      submission: this.props.submission
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
            upVoteAction={this.upVoteAction}
            removeUpVoteAction={this.removeUpVoteAction}/>
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
  },

  removeUpVoteAction: function() {
    this.props.removeUpVoteAction(this.state.submission.id, () => {
      this.setState({
        submission: CampusChallengeUtils.removeUpVoteOnSubmission(this.state.submission)
      });
    });
  }

});

module.exports = CampusChallengeSubmissionPopup;
