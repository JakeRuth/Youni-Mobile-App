'use strict';

var React = require('react');
var ReactNative = require('react-native');

var LoggedInUserCampusChallengeSubmissionsPopup = require('../PopupPages/LoggedInUserCampusChallengeSubmissionsPopup');

var Colors = require('../../Utils/Common/Colors');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var {
  TouchableHighlight,
  Text,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 34,
    borderRadius: 4,
    marginTop: 18,
    marginBottom: 6,
    marginHorizontal: 10
  },
  label: {
    color: Colors.WHITE_SMOKE,
    fontSize: 16
  }
});

var ViewCampusChallengeSubmissionButton = React.createClass({

  propTypes: {
    campusChallenge: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      submissions: []
    };
  },

  componentDidMount: function() {
    this._requestSubmissions();
  },

  render: function() {
    return (
      <TouchableHighlight
        style={[styles.container, { backgroundColor: this._getContainerBackgroundColor() }]}
        underlayColor={this._getContainerBackgroundColor()}
        onPress={this._onPress}>

        <Text style={styles.label}>
          {this._getButtonLabel()}
        </Text>

      </TouchableHighlight>
    );
  },
  
  _onPress: function() {
    if (this.state.submissions.length > 0) {
      this.props.navigator.push({
        component: LoggedInUserCampusChallengeSubmissionsPopup,
        passProps: {
          submissions: this.state.submissions,
          navigator: this.props.navigator
        }
      });
    }
  },

  _getButtonLabel: function() {
    if (this.state.submissions.length <= 1) {
      return 'View My Submission';
    }
    else {
      return 'View My Submissions';
    }
  },

  _getContainerBackgroundColor: function() {
    if (this.state.submissions.length === 0) {
      return Colors.LIGHT_GRAY;
    }
    else {
      return Colors.getPrimaryAppColor();
    }
  },

  _requestSubmissions: function() {
    var that = this;

    AjaxUtils.ajax(
      '/campusChallenge/getSubmissionsForUser',
      {
        campusChallengeIdString: this.props.campusChallenge.id,
        userEmail: userLoginMetadataStore.getEmail()
      },
      (res) => {
        that.setState({
          submissions: res.body.submissions
        });
      },
      () => {

      }
    );
  }

});

module.exports = ViewCampusChallengeSubmissionButton;
