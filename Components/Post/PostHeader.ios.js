'use strict'

var React = require('react-native');
var Unicycle = require('../../Unicycle')
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
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10
  },
  posterImage: {
    height: 45,
    width: 45,
    borderRadius: 22,
    marginRight: 10
  },
  profileImageAndNameContainer: {
    flex: 4
  },
  profileImageAndName: {
    flex: 1,
    flexDirection: 'row'
  },
  profileName: {
    flex: 1,
    fontSize: 20,
    alignSelf: 'center'
  },
  timestamp: {
    flex: 1,
    alignSelf: 'center',
    color: 'darkgray'
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
    viewerIsPostOwner: React.PropTypes.bool,
    renderedFromProfileView: React.PropTypes.bool
  },

  render: function() {
    //TODO: Theres probably a better way to branch this logic, worth revisiting when we solve #techdebt
    var profileImageOrDeleteIcon = <View/>,
        flagPostIcon = <View/>;

    if (this.props.posterProfileImageUrl) {
      profileImageOrDeleteIcon = (
        <Image style={styles.posterImage} source={{uri: this.props.posterProfileImageUrl}} />
      );
    }

    if (this.props.viewerIsPostOwner) {
      profileImageOrDeleteIcon = (
        <DeletePostIcon
          id={this.props.id}
          postIdString={this.props.postIdString} />
      );
    }
    else {
      flagPostIcon = (
        <FlagPostIcon postId={this.props.postIdString}/>
      );
    }

    return (
      <View style={styles.postHeader}>

        <TouchableHighlight
          style={styles.profileImageAndNameContainer}
          onPress={this.onProfilePress}
          underlayColor='transparent'>

          <View style={styles.profileImageAndName}>
            {profileImageOrDeleteIcon}
            <Text style={styles.profileName} numberOfLines={1}>
              {this.props.posterName}
            </Text>
          </View>

        </TouchableHighlight>

        {flagPostIcon}
        <Text style={styles.timestamp}>{this.props.timestamp}</Text>

      </View>
    );
  },

  onProfilePress: function() {
    var userId;

    if (!this.props.viewerIsPostOwner && !this.props.renderedFromProfileView) {
      userId = userLoginMetadataStore.getUserId();
      Unicycle.exec('reInitializeUsersProfileFeedOffset');
      Unicycle.exec('loadUsersProfile', this.props.posterEmail);
      Unicycle.exec('getUserPosts', this.props.posterEmail, userId);
      Unicycle.exec('setProfileModalVisibile', true);
    }
  }

});

module.exports = PostHeader;
