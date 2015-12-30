'use strict';

var React = require('react-native');
var FollowUnfollowButton = require('./FollowUnfollowButton');
var FollowingButton = require('./FollowingButton');
var EditSettingsButton = require('./Settings/EditSettingsButton');
var BlockUserButton = require('./BlockUserButton');
var ProfileImage = require('./ProfileImage');
var UserPosts = require('./UserPosts');
var profileOwnerStore = require('../../stores/profile/ProfileOwnerStore');
var profileStore = require('../../stores/profile/ProfileStore');

var {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView
} = React

var styles = StyleSheet.create({
  profileBodyContent: {
    flex: 1
  },
  fullName: {
    textAlign: 'center',
    fontSize: 30,
    margin: 5,
    backgroundColor: 'transparent'
  },
  fanCount: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: '800'
  },
  bio: {
    alignSelf: 'auto',
    margin: 30
  }
});

var ProfilePageBody = React.createClass({

  propTypes: {
    firstName: React.PropTypes.string.isRequired,
    lastName: React.PropTypes.string.isRequired,
    bio: React.PropTypes.string,
    numFans: React.PropTypes.number.isRequired,
    profileImageUrl: React.PropTypes.string.isRequired,
    email: React.PropTypes.string.isRequired,
    viewerIsProfileOwner: React.PropTypes.bool.isRequired
  },

  render: function() {
    var fullName = this.props.firstName + ' ' + this.props.lastName,
        followButton = <View/>,
        seeWhoImFollowingButton = <View/>,
        editSettingsIcon = <View/>,
        blockUserIcon = <View/>,
        bio = this.props.bio;

    if (this.props.viewerIsProfileOwner) {
      seeWhoImFollowingButton = <FollowingButton email={this.props.email}/>;
      editSettingsIcon = <EditSettingsButton/>;
    }
    else {
      followButton = <FollowUnfollowButton email={this.props.email}/>;
      blockUserIcon = <BlockUserButton email={this.props.email}/>;
    }

    return (
      <ScrollView style={styles.profileBodyContent}>

        <Text style={styles.fullName}>{fullName}</Text>
        {editSettingsIcon}
        {blockUserIcon}

        <ProfileImage
          viewerIsProfileOwner={this.props.viewerIsProfileOwner}
          profileImageUrl={this.props.profileImageUrl}/>

        <Text style={styles.fanCount}>{this._getFansText(this.props.numFans)}</Text>
        <Text style={styles.bio}>{this.props.bio}</Text>
        {followButton}
        {seeWhoImFollowingButton}
        <UserPosts
          profileStore={this._getProfileStoreForUserPosts()}
          userName={fullName}
          userEmail={this.props.email}
          viewerIsProfileOwner={this.props.viewerIsProfileOwner} />

      </ScrollView>
    );
  },

  //TODO: This is more then likely something we want to api to handle
  _getFansText: function(numFans) {
    if (numFans == 0) {
      return 'No fans :(';
    }
    else if (numFans == 1) {
      return numFans + ' fan';
    }
    else {
      return numFans + ' fans';
    }
  },

  _getProfileStoreForUserPosts: function() {
    if (this.props.viewerIsProfileOwner) {
      return profileOwnerStore;
    }
    else {
      return profileStore;
    }
  }

});

module.exports = ProfilePageBody;
