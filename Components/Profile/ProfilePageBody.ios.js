'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var FollowButton = require('./FollowButton');
var BlockUserButton = require('./BlockUserButton');
var ProfileImage = require('./ProfileImage');
var TotalProfileCountsContainer = require('./TotalProfileCountsContainer');
var UserPosts = require('./UserPosts');
var UserFollowingListPopup = require('../PopUpPages/UserFollowingListPopup');
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
      Unicycle.exec('isUserFollowing', userId, this.props.email);
    }
  },

  propTypes: {
    navigator: React.PropTypes.object.isRequired,
    firstName: React.PropTypes.string.isRequired,
    lastName: React.PropTypes.string.isRequired,
    bio: React.PropTypes.string,
    numFans: React.PropTypes.number.isRequired,
    numPosts: React.PropTypes.number.isRequired,
    totalPoints: React.PropTypes.number.isRequired,
    profileImageUrl: React.PropTypes.string.isRequired,
    email: React.PropTypes.string.isRequired,
    viewerIsProfileOwner: React.PropTypes.bool.isRequired
  },

  mixins: [
    Unicycle.listenTo(followUnfollowStore)
  ],

  render: function() {
    var blockUserIcon = <View/>;

    if (!this.props.viewerIsProfileOwner) {
      blockUserIcon = <BlockUserButton email={this.props.email}/>;
    }

    return (
      <ScrollView
        onScroll={this.onScroll}>

        <View style={styles.profileInformationContainer}>

          <View style={styles.profileHeader}>
            <ProfileImage
              viewerIsProfileOwner={this.props.viewerIsProfileOwner}
              profileImageUrl={this.props.profileImageUrl}/>
            <FollowButton
              viewerIsProfileOwner={this.props.viewerIsProfileOwner}
              onButtonPress={this._getFollowButtonAction}
              isRequestInFlight={this._isFollowButtonRequestInFlight()}/>
          </View>

          {blockUserIcon}
          <Text style={styles.bio}>
            {this.props.bio}
          </Text>

          <TotalProfileCountsContainer
            totalPoints={this.props.totalPoints}
            numFans={this.props.numFans}
            numPosts={this.props.numPosts}/>

        </View>

        <UserPosts
          profileStore={this._getProfileStoreForUserPosts()}
          userName={this.props.firstName + ' ' + this.props.lastName}
          userEmail={this.props.email}
          viewerIsProfileOwner={this.props.viewerIsProfileOwner}
          navigator={this.props.navigator}/>
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
      Unicycle.exec('unfollow', userId, this.props.email);
    }
    else {
      Unicycle.exec('follow', userId, this.props.email);
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
