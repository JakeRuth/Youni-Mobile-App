'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Unicycle = require('../../Unicycle');

var DeletePostIcon = require('./DeletePostIcon');
var FlagPostIcon = require('./FlagPostIcon');
var ProfilePopup = require('../PopupPages/ProfilePopup');
var ProfileImageThumbnail = require('../Common/ProfileImageThumbnail');
var ProfileOwnerPage = require('../Profile/ProfileOwnerPage');

var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 70,
    flexDirection: 'row'
  },
  posterThumbnail: {
    padding: 10,
    flex: 1,
    flexDirection: 'row'
  },
  nameAndTimestampContainer: {
    flex: 1
  },
  profileName: {
    fontSize: 16,
    marginLeft: 12,
    color: Colors.DARK_GRAY
  },
  timestamp: {
    flex: 1,
    marginTop: 5,
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
            enabled={this.props.renderedFromProfileView}
            navigator={this.props.navigator}/>
        </View>
      );
    }
    else {
      actionButton = (
        <View style={styles.actionButtonContainer}>
          <FlagPostIcon postId={this.props.post.postIdString}/>
        </View>
      );
    }

    return (
      <View style={styles.container}>

        <TouchableHighlight
          onPress={this.onProfilePress}
          underlayColor='transparent'>

          <View style={styles.posterThumbnail}>
            <ProfileImageThumbnail profileImageUrl={this.props.post.posterProfilePictureUrl}/>
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
    if (this.props.renderedFromProfileView) {
      return;
    }

    if (this._isViewerPostOwner()) {
      this.props.navigator.push({
        component: ProfileOwnerPage
      });
    }
    else {
      this.props.navigator.push({
        component: ProfilePopup,
        passProps: {
          profileUserEmail: this.props.post.posterEmail
        }
      });
    }
  },

  _isViewerPostOwner: function() {
    return this.props.post.posterEmail === userLoginMetadataStore.getEmail();
  }

});

module.exports = PostHeader;
