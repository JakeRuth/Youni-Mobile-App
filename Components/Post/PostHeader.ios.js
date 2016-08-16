'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Unicycle = require('../../Unicycle');

var DeletePostIcon = require('./DeletePostIcon');
var FlagPostIcon = require('./FlagPostIcon');
var ProfilePopup = require('../PopupPages/ProfilePopup');
var ProfileImageThumbnail = require('../Common/ProfileImageThumbnail');

var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var statusBarStyleStore = require('../../stores/StatusBarStyleStore');
var Colors = require('../../Utils/Common/Colors');
var IosStatusBarStyles = require('../../Utils/Common/IosStatusBarStyles');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  postHeader: {
    flex: 1,
    flexDirection: 'row'
  },
  posterThumbnail: {
    padding: 10,
    flex: 1,
    flexDirection: 'row'
  },
  nameAndTimestampContainer: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 5
  },
  profileName: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
    color: Colors.DARK_GRAY
  },
  timestamp: {
    flex: 1,
    fontSize: 13,
    marginLeft: 12,
    color: Colors.MED_GRAY
  },
  actionButtonContainer: {
    position: 'absolute',
    right: 12,
    top: 15
  }
});

var PostHeader = React.createClass({

  propTypes: {
    post: React.PropTypes.object.isRequired,
    renderedFromProfileView: React.PropTypes.bool,
    hideActionButton: React.PropTypes.bool,
    navigator: React.PropTypes.object
  },

  render: function() {
    var actionButton;

    if (this._isViewerPostOwner()) {
      actionButton = (
        <View style={styles.actionButtonContainer}>
          <DeletePostIcon
            id={this.props.post.id}
            postIdString={this.props.post.postIdString}
            enabled={this.props.renderedFromProfileView}/>
        </View>
      );
    }
    else if (!this.props.hideActionButton) {
      actionButton = (
        <View style={styles.actionButtonContainer}>
          <FlagPostIcon postId={this.props.post.postIdString}/>
        </View>
      );
    }

    return (
      <View style={styles.postHeader}>

        <TouchableHighlight
          onPress={this.onProfilePress}
          underlayColor='transparent'>

          <View style={styles.posterThumbnail}>
            <ProfileImageThumbnail profileImageUrl={this.props.post.posterProfileImageUrl}/>
            <View style={styles.nameAndTimestampContainer}>
              <Text
                style={styles.profileName}
                numberOfLines={1}>
                {this.props.post.posterName}
              </Text>
              <Text style={styles.timestamp}>
                {this.props.post.timestamp}
              </Text>
            </View>
          </View>

        </TouchableHighlight>

        {actionButton}

      </View>
    );
  },

  onProfilePress: function() {
    if (this._shouldDisplayProfilePopup()) {
      this.props.navigator.push({
        component: ProfilePopup,
        passProps: {
          profileUserEmail: this.props.post.posterEmail,
          onBackArrowPress: () => statusBarStyleStore.setStyle(IosStatusBarStyles.LIGHT_CONTENT)
        }
      });
    }
  },

  _shouldDisplayProfilePopup: function() {
    return !this._isViewerPostOwner() && !this.props.renderedFromProfileView && !this.props.hideActionButton;
  },

  _isViewerPostOwner: function() {
    return this.props.post.posterEmail === userLoginMetadataStore.getEmail();
  }

});

module.exports = PostHeader;
