'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var DeletePostIcon = require('./DeletePostIcon');
var FlagPostIcon = require('./FlagPostIcon');
var ProfilePopup = require('../PopupPages/ProfilePopup');
var ProfileImageThumbnail = require('../Common/ProfileImageThumbnail');
var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  postHeader: {
    flex: 1,
    flexDirection: 'row'
  },
  leftSide: {
    padding: 10,
    flex: 1,
    flexDirection: 'row'
  },
  posterImage: {
    height: 40,
    width: 40,
    borderRadius: 12,
    marginRight: 10
  },
  profileName: {
    flex: 1,
    fontWeight: '100',
    fontSize: 16,
    marginLeft: 12,
    color: Colors.DARK_GRAY,
    width: Dimensions.get('window').width * .66
  },
  timestamp: {
    fontSize: 13,
    fontWeight: '100',
    marginLeft: 12,
    color: Colors.MED_GRAY
  },
  actionButtonContainer: {
    position: 'absolute',
    right: 12,
    top: 20
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

          <View style={styles.leftSide}>
            <ProfileImageThumbnail profileImageUrl={this.props.post.posterProfileImageUrl}/>
            <View>
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
        passProps: {profileUserEmail: this.props.post.posterEmail}
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
