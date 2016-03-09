'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var DeletePostIcon = require('./DeletePostIcon');
var FlagPostIcon = require('./FlagPostIcon');
var ProfilePopup = require('../PopupPages/ProfilePopup');
var Emoji = require('../Common/Emoji');

var {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  postHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    height: 53,
    padding: 5
  },
  thumbnailContainer: {
    flex: 9
  },
  thumbnail: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  posterImage: {
    height: 45,
    width: 45,
    borderRadius: 22.5
  },
  profileName: {
    flex: 1,
    fontSize: 17,
    fontWeight: '400',
    color: '#4C4C4C'
  },
  timestamp: {
    flex: 3,
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 13,
    color: '#ADADAD'
  },
  actionButtonContainer: {
    flex: 1,
    marginRight: -10,
    alignSelf: 'center',
    backgroundColor: 'transparent'
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
          style={styles.thumbnailContainer}
          onPress={this.onProfilePress}
          underlayColor='transparent'>
          <View style={styles.thumbnail}>

            {/* This image may not exist!!! */}
            <Image
              style={styles.posterImage}
              source={{uri: this.props.post.posterProfileImageUrl}}/>

            <Text
              style={styles.profileName}
              numberOfLines={1}>
              {this._renderTrendingEmoji()}
              {this.props.post.posterName}
            </Text>

          </View>
        </TouchableHighlight>

        <Text style={styles.timestamp}>
          {this.props.post.timestamp}
        </Text>

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

  _renderTrendingEmoji: function() {
    if (this.props.post.isPostUserCurrentlyTrending) {
      return (
        <Emoji
          name="fire"
          size={22}/>
      );
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
