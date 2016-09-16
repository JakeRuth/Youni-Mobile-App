'use strict';

var React = require('react');
var ReactNative = require('react-native');
var DismissKeyboard = require('dismissKeyboard');

var ProfilePopup = require('../../PopupPages/ProfilePopup');
var ProfileImageThumbnail = require('../../Common/ProfileImageThumbnail');
var TruncatedText = require('../../Common/TruncatedText');

var Colors = require('../../../Utils/Common/Colors');
var IosStatusBarStyles = require('../../../Utils/Common/IosStatusBarStyles');
var statusBarStyleStore = require('../../../stores/StatusBarStyleStore');
var userLoginMetadataStore = require('../../../stores/UserLoginMetadataStore');

var {
  View,
  Text,
  AlertIOS,
  ActionSheetIOS,
  TouchableHighlight,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingBottom: 8
  },
  profilePictureContainer: {
    marginRight: 8
  },
  profilePicture: {
    height: 32,
    width: 32,
    borderRadius: 8
  },
  nameAndTextContainer: {
    flex: 1
  },
  commenterName: {
    textAlign: 'left',
    color: Colors.DARK_GRAY,
    fontSize: 12
  }
});

var Comment = React.createClass({

  propTypes: {
    comment: React.PropTypes.shape({
      comment: React.PropTypes.string.isRequired,
      commenterName: React.PropTypes.string.isRequired,
      commenterEmail: React.PropTypes.string.isRequired,
      commenterProfilePicture: React.PropTypes.string
    }).isRequired,
    onDeleteCommentAction: React.PropTypes.func.isRequired,
    post: React.PropTypes.object.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      isDeleteRequestInFlight: false
    };
  },

  // TODO: If you want to get mad, change this top level TouchableHighlight to a View, for some reason
  // it makes it so that you can't scroll through comments... I can't figure out why
  render: function() {
    return (
      <TouchableHighlight
        style={this._getContainerStyle()}
        underlayColor="transparent"
        onPress={this.onPress}>
        <View style={styles.container}>

          <TouchableHighlight
            style={styles.profilePictureContainer}
            underlayColor="transparent"
            onPress={this._onCommenterNamePress}>
            <View>
              <ProfileImageThumbnail
                style={styles.profilePicture}
                profileImageUrl={this.props.comment.commenterProfilePicture}/>
            </View>
          </TouchableHighlight>

          <View style={styles.nameAndTextContainer}>
            <Text
              style={styles.commenterName}
              onPress={this._onCommenterNamePress}
              numberOfLines={1}>
              {this.props.comment.commenterName}
            </Text>
            <TruncatedText text={this.props.comment.comment}/>
          </View>

        </View>
      </TouchableHighlight>
    );
  },

  onPress: function() {
    DismissKeyboard();
    if (this._isLoggedInUserCommentOwner() && this.props.onDeleteCommentAction) {
      this._showDeleteCommentActionSheet();
    }
  },

  _onCommenterNamePress: function() {
    if (!this._isLoggedInUserCommentOwner()) {
      this.props.navigator.push({
        component: ProfilePopup,
        passProps: {
          profileUserEmail: this.props.comment.commenterEmail,
          onBackArrowPress: () => statusBarStyleStore.setStyle(IosStatusBarStyles.LIGHT_CONTENT)
        }
      })
    }
    else {
      this._showDeleteCommentActionSheet();
    }
  },

  _showDeleteCommentActionSheet: function() {
    ActionSheetIOS.showActionSheetWithOptions({
      options: [
        'Delete comment',
        'Cancel'
      ],
      cancelButtonIndex: 1,
      tintColor: Colors.getPrimaryAppColor()
    },
    (buttonIndex) => {
      if (buttonIndex === 0) {
        this._alertConfirmDelete();
      }
    });
  },

  _alertConfirmDelete: function() {
    AlertIOS.alert(
      'Are you sure you want to permanently remove this comment?',
      '',
      [
        {
          text: 'Yes',
          onPress: this._onConfirmDeleteComment
        },
        {
          text: 'No'
        }
      ]
    );
  },

  _onConfirmDeleteComment: function() {
    this.setState({
      isDeleteRequestInFlight: true
    });

    this.props.onDeleteCommentAction(this.props.comment, this.props.post, () => {
      this.setState({
        isDeleteRequestInFlight: false
      });
    })
  },

  _getContainerStyle: function() {
    if (this.state.isDeleteRequestInFlight) {
      return {
        opacity: .5
      };
    }
  },

  _isLoggedInUserCommentOwner: function() {
    return this.props.comment.commenterEmail && userLoginMetadataStore.getEmail() === this.props.comment.commenterEmail;
  }

});

module.exports = Comment;
