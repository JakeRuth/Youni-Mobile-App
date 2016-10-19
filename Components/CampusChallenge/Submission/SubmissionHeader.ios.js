'use strict';

var React = require('react');
var ReactNative = require('react-native');

var PostActionButton = require('../../Post/PostActionButton');
var Emoji = require('../../Common/Emoji');
var ProfileImageThumbnail = require('../../Common/ProfileImageThumbnail');

var Colors = require('../../../Utils/Common/Colors');
var userLoginMetadataStore = require('../../../stores/UserLoginMetadataStore');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight
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
          <PostActionButton onPress={() => null}/>
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
    if (this.props.navigator && this.props.submission.isAnonymous) {
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
  }


});

module.exports = SubmissionHeader;
