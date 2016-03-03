'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var DeletePostIcon = require('./DeletePostIcon');
var FlagPostIcon = require('./FlagPostIcon');
var ProfilePopup = require('../PopupPages/ProfilePopup');

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
    minHeight: 45,
    padding: 5
  },
  thumbnailContainer: {
    flex: 5
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
    color: '#4C4C4C',
    marginLeft: 5
  },
  timestamp: {
    flex: 2,
    alignSelf: 'center',
    textAlign: 'right',
    fontSize: 13,
    color: '#ADADAD'
  },
  actionButtonContainer: {
    flex: 1,
    alignSelf: 'center',
    backgroundColor: 'transparent'
  }
});

var PostHeader = React.createClass({

  propTypes: {
    id: React.PropTypes.number.isRequired,
    postIdString: React.PropTypes.string.isRequired,
    posterEmail: React.PropTypes.string.isRequired,
    posterProfileImageUrl: React.PropTypes.string,
    posterName: React.PropTypes.string.isRequired,
    timestamp: React.PropTypes.string.isRequired,
    renderedFromProfileView: React.PropTypes.bool,
    hideActionButton: React.PropTypes.bool,
    navigator: React.PropTypes.object
  },

  render: function() {
    var actionButton = <View/>;

    if (this._isViewerPostOwner()) {
      actionButton = (
        <View style={styles.actionButtonContainer}>
          <DeletePostIcon
            id={this.props.id}
            postIdString={this.props.postIdString}
            enabled={this.props.renderedFromProfileView}/>
        </View>
      );
    }
    else if (!this.props.hideActionButton) {
      actionButton = (
        <View style={styles.actionButtonContainer}>
          <FlagPostIcon postId={this.props.postIdString}/>
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
              source={{uri: this.props.posterProfileImageUrl}} />
            <Text
              style={styles.profileName}
              numberOfLines={1}>
              {this.props.posterName}
            </Text>

          </View>
        </TouchableHighlight>

        <Text style={styles.timestamp}>
          {this.props.timestamp}
        </Text>

        {actionButton}

      </View>
    );
  },

  onProfilePress: function() {
    if (this._shouldDisplayProfilePopup()) {
      this.props.navigator.push({
        component: ProfilePopup,
        passProps: {profileUserEmail: this.props.posterEmail}
      });
    }
  },

  _shouldDisplayProfilePopup: function() {
    return !this._isViewerPostOwner() && !this.props.renderedFromProfileView && !this.props.hideActionButton;
  },

  _isViewerPostOwner: function() {
    return this.props.posterEmail === userLoginMetadataStore.getEmail();
  }

});

module.exports = PostHeader;
