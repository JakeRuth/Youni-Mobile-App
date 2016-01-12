'use strict'

var React = require('react-native');
var Unicycle = require('../../Unicycle')
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var DeletePostIcon = require('./DeletePostIcon');
var FlagPostIcon = require('./FlagPostIcon');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

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
    flexDirection: 'row'
  },
  thumbnailContainer: {
    flex: 1
  },
  thumbnail: {
    flex: 4,
    flexDirection: 'row',
    alignItems: 'center'
  },
  posterImage: {
    height: 35,
    width: 35,
    borderRadius: 18,
    marginLeft: 8
  },
  nameAndTimestampContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: 6,
    paddingLeft: 8
  },
  profileName: {
    flex: 1,
    fontSize: 17,
    fontWeight: '400',
    color: '#4C4C4C'
  },
  timestamp: {
    flex: 1,
    fontSize: 13,
    color: '#B2B2B2'
  },
  actionButtonContainer: {
    right: 8,
    top: 6
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
    hideActionButton: React.PropTypes.bool
  },

  render: function() {
    var profileImage = <View/>,
        actionButton = <View/>;

    if (this.props.posterProfileImageUrl) {
      profileImage = (
        <Image style={styles.posterImage} source={{uri: this.props.posterProfileImageUrl}} />
      );
    }
    
    if (this._isViewerPostOwner()) {
      actionButton = (
        <DeletePostIcon
          id={this.props.id}
          postIdString={this.props.postIdString}
          enabled={this.props.renderedFromProfileView}/>
      );
    }
    else if (!this.props.hideActionButton) {
      actionButton = (
        <FlagPostIcon postId={this.props.postIdString}/>
      );
    }

    return (
      <View style={styles.postHeader}>

        <TouchableHighlight
          style={styles.thumbnailContainer}
          onPress={this.onProfilePress}
          underlayColor='transparent'>

          <View style={styles.thumbnail}>
            {profileImage}

            <View style={styles.nameAndTimestampContainer}>
              <Text style={styles.profileName} numberOfLines={1}>
                {this.props.posterName}
              </Text>
              <Text style={styles.timestamp}>
                {this.props.timestamp} ago
              </Text>
            </View>

          </View>

        </TouchableHighlight>

        <View style={styles.actionButtonContainer}>
          {actionButton}
        </View>

      </View>
    );
  },

  onProfilePress: function() {
    var userId;

    if (!this._isViewerPostOwner() && !this.props.renderedFromProfileView && !this.props.hideActionButton) {
      userId = userLoginMetadataStore.getUserId();
      Unicycle.exec('reInitializeUsersProfileFeedOffset');
      Unicycle.exec('loadUsersProfile', this.props.posterEmail);
      Unicycle.exec('getUserPosts', this.props.posterEmail, userId);
      Unicycle.exec('setProfileModalVisibile', true);
    }
  },

  _isViewerPostOwner: function() {
    return this.props.posterEmail === userLoginMetadataStore.getEmail();
  }

});

module.exports = PostHeader;
