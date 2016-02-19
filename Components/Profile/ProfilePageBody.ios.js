'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var FollowButton = require('./FollowButton');
var BlockUserButton = require('./BlockUserButton');
var ProfileImage = require('./ProfileImage');
var TotalProfileCountsContainer = require('./TotalProfileCountsContainer');
var UserFollowingListPopup = require('../PopupPages/UserFollowingListPopup');
var profileOwnerStore = require('../../stores/profile/ProfileOwnerStore');
var profileStore = require('../../stores/profile/ProfileStore');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var followUnfollowStore = require('../../stores/FollowStore');

var {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView
} = React;

var styles = StyleSheet.create({
  profileInformationContainer: {
    backgroundColor: 'white'
  },
  profileHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2
  },
  bio: {
    color: '#525252',
    fontSize: 12,
    margin: 10
  },
  blankLine: {
    borderWidth: 1,
    borderColor: 'lightgray'
  }
});

var ProfilePageBody = React.createClass({

  componentDidMount: function() {
    var userId;
    if (!this.props.viewerIsProfileOwner) {
      userId = userLoginMetadataStore.getUserId();
      Unicycle.exec('isUserFollowing', userId, this.props.user.email);
    }
  },

  propTypes: {
    navigator: React.PropTypes.object.isRequired,
    user: React.PropTypes.object.isRequired,
    viewerIsProfileOwner: React.PropTypes.bool.isRequired
  },

  render: function() {
    var blockUserIcon = <View/>;

    if (!this.props.viewerIsProfileOwner) {
      blockUserIcon = <BlockUserButton email={this.props.user.email}/>;
    }

    return (
      <ScrollView
        onScroll={this.onScroll}>

        <View style={styles.profileInformationContainer}>

          <View style={styles.profileHeader}>
            <ProfileImage
              viewerIsProfileOwner={this.props.viewerIsProfileOwner}
              profileImageUrl={this.props.user.profileImageUrl}/>
            <FollowButton
              viewerIsProfileOwner={this.props.viewerIsProfileOwner}
              onButtonPress={this._getFollowButtonAction}
              isRequestInFlight={this._isFollowButtonRequestInFlight()}/>
          </View>

          {blockUserIcon}
          <Text style={styles.bio}>
            {this.props.user.bio}
          </Text>

          <TotalProfileCountsContainer
            totalPoints={this.props.user.totalPoints}
            numFollowers={this.props.user.numFollowers}
            numPosts={this.props.user.numPosts}/>

        </View>
      </ScrollView>
    );
  },

  onScroll: function(e) {
    var userId = userLoginMetadataStore.getUserId(),
        userEmail = userLoginMetadataStore.getEmail();

    if (this.props.viewerIsProfileOwner && e.nativeEvent.contentOffset.y < -1) {
      Unicycle.exec('refreshProfileOwnerPosts', userEmail, userId);
    }
  },

  _getFollowButtonAction: function() {
    if (this.props.viewerIsProfileOwner) {
      this._getAllUsersTheOwnerIsFollowing();
    }
    else {
      this._followOrUnfollowUser();
    }
  },

  _isFollowButtonRequestInFlight: function() {
    if (this.props.viewerIsProfileOwner) {
      return false;
    }
    else {
      return followUnfollowStore.isRequestInFlight();
    }
  },

  _getAllUsersTheOwnerIsFollowing: function() {
    this.props.navigator.push({
      component: UserFollowingListPopup
    });
  },

  _followOrUnfollowUser: function() {
    var userId = userLoginMetadataStore.getUserId();

    if (followUnfollowStore.getIsUserFollowingResult()) {
      Unicycle.exec('unfollow', userId, this.props.user.email);
    }
    else {
      Unicycle.exec('follow', userId, this.props.user.email);
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
