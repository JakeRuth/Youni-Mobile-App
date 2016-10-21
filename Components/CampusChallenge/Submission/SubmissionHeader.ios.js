'use strict';

var React = require('react');
var ReactNative = require('react-native');

var PostActionButton = require('../../Post/PostActionButton');
var Emoji = require('../../Common/Emoji');
var ProfileImageThumbnail = require('../../Common/ProfileImageThumbnail');

var Colors = require('../../../Utils/Common/Colors');
var AjaxUtils = require('../../../Utils/Common/AjaxUtils');
var userLoginMetadataStore = require('../../../stores/UserLoginMetadataStore');

var {
  View,
  Text,
  StyleSheet,
  AlertIOS,
  TouchableHighlight,
  ActionSheetIOS
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    height: 64,
    flexDirection: 'row'
  },
  thumbnail: {
    padding: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  nameAndTimestampContainer: {
    flex: 1,
    marginLeft: 12
  },
  anonymousEmojiContainer: {
    height: 40,
    width: 40,
    backgroundColor: Colors.LIGHT_GRAY,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  name: {
    flex: 1,
    fontSize: 16,
    color: Colors.DARK_GRAY
  },
  timestamp: {
    flex: 1,
    marginTop: 5,
    fontSize: 13,
    color: Colors.MED_GRAY
  },
  actionButtonContainer: {
    position: 'absolute',
    right: 12,
    top: 15
  }
});

// very similar to <PostHeader/>
var SubmissionHeader = React.createClass({

  propTypes: {
    submission: React.PropTypes.object.isRequired,
    onDeleteSubmission: React.PropTypes.func,
    navigator: React.PropTypes.object
  },

  render: function() {
    return (
      <View style={styles.container}>

        <TouchableHighlight
          onPress={this.onPress}
          underlayColor='transparent'>
          {this.renderThumbnail()}
        </TouchableHighlight>

        <View style={styles.actionButtonContainer}>
          <PostActionButton onPress={this._onActionButtonPress}/>
        </View>

      </View>
    );
  },

  renderThumbnail: function() {
    let thumbnailImage, label;

    if (this.props.submission.isAnonymous) {
      label = 'Anonymous';
      thumbnailImage = (
        <View style={styles.anonymousEmojiContainer}>
          <Emoji
            name="sunglasses"
            size={25}/>
        </View>
      );
    }
    else {
      label = `${this.props.submission.user.firstName} ${this.props.submission.user.lastName}`;
      thumbnailImage = <ProfileImageThumbnail profileImageUrl={this.props.submission.user.profileImageUrl}/>;
    }

    return (
      <View style={styles.thumbnail}>
        {thumbnailImage}
        <View style={styles.nameAndTimestampContainer}>
          <Text
            style={styles.name}
            numberOfLines={1}>
            {label}
          </Text>
          <Text style={styles.timestamp}>
            {this.props.submission.timestamp}
          </Text>
        </View>
      </View>
    );
  },

  onPress: function() {
    if (!this.props.navigator && this.props.submission.isAnonymous) {
      return;
    }

    if (userLoginMetadataStore.getEmail() === this.props.submission.user.email) {
      this.props.navigator.push({
        component: require('../../Profile/ProfileOwnerPage')
      });
    }
    else {
      this.props.navigator.push({
        component: require('../../PopupPages/ProfilePopup'),
        passProps: {
          profileUserEmail: this.props.submission.user.email
        }
      });
    }
  },

  _onActionButtonPress: function() {
    if (userLoginMetadataStore.getEmail() === this.props.submission.user.email) {
      this._showSubmissionOwnerActionButtonOptions();
    }
    else {
      this._showActionButtonOptions();
    }
  },

  _showSubmissionOwnerActionButtonOptions: function() {
    ActionSheetIOS.showActionSheetWithOptions({
      options: [
        'Delete Submission',
        'Cancel'
      ],
      cancelButtonIndex: 1,
      tintColor: Colors.getPrimaryAppColor()
    },
    (buttonIndex) => {
      if (buttonIndex === 0) {
        if (this.props.onDeleteSubmission) {
          AlertIOS.alert(
            'Are you sure you want to delete this submission?',
            'You cannot undo this action.',
            [
              {
                text: 'Yes',
                onPress: () => this.props.onDeleteSubmission(this.props.submission.id)
              },
              {
                text: 'No'
              }
            ]
          );
        }
        else {
          this._alertCannotDeletePost();
        }
      }
    });
  },

  _showActionButtonOptions: function() {
    ActionSheetIOS.showActionSheetWithOptions({
      options: [
        'Flag Submission',
        'Cancel'
      ],
      cancelButtonIndex: 1,
      tintColor: Colors.getPrimaryAppColor()
    },
    (buttonIndex) => {
      if (buttonIndex === 0) {
        this._sendFlagSubmissionRequest();
        this._alertSuccessfulSubmissionFlag();
      }
    });
  },

  _sendFlagSubmissionRequest: function() {
    var userEmail = userLoginMetadataStore.getEmail();

    AjaxUtils.ajax(
      '/campusChallenge/flagSubmission',
      {
        userEmail: userEmail,
        campusChallengeSubmissionIdString: this.props.submission.id
      },
      (res) => {
        //no opt
      },
      () => {
        //no opt
      }
    );
  },

  _alertPostDeleted: function() {
    AlertIOS.alert(
      "Post Deleted",
      '',
      [
        {
          text: 'Okay'
        }
      ]
    );
  },

  _alertCannotDeletePost: function() {
    AlertIOS.alert(
      "You can only delete submissions from the 'View My Submission(s) button.",
      'Located on the home page for the challenge.',
      [
        {
          text: 'Okay'
        }
      ]
    );
  },
  
  _alertSuccessfulSubmissionFlag: function() {
    AlertIOS.alert(
      'Submission flagged',
      '',
      [
        {text: 'Got it'}
      ]
    );
  }

});

module.exports = SubmissionHeader;
