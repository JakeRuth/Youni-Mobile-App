'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var FollowButton = require('./FollowButton');
var EditSettingsButton = require('./Settings/EditSettingsButton');
var BlockUserButton = require('./BlockUserButton');
var ProfileImage = require('./ProfileImage');
var CoverImage = require('./CoverImage');
var TotalProfileCountsContainer = require('./TotalProfileCountsContainer');
var UserPosts = require('./UserPosts');
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
} = React

var styles = StyleSheet.create({
  profileBodyContent: {
    backgroundColor: '#f2f2f2',
    flexDirection: 'column'
  },
  profileInformationContainer: {
    backgroundColor: 'white'
  },
  profileImageFollowButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  fullName: {
    top: 10,
    fontSize: 23,
    fontWeight: '400',
    left: 20,
    color: '#767676',
    marginBottom: 10
  },
  bio: {
    color: 'grey',
    alignSelf: 'auto',
    top: 5,
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20
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
    firstName: React.PropTypes.string.isRequired,
    lastName: React.PropTypes.string.isRequired,
    bio: React.PropTypes.string,
    numFans: React.PropTypes.number.isRequired,
    profileImageUrl: React.PropTypes.string.isRequired,
    email: React.PropTypes.string.isRequired,
    viewerIsProfileOwner: React.PropTypes.bool.isRequired
  },

  mixins: [
    Unicycle.listenTo(followUnfollowStore)
  ],

  render: function() {
    var editSettingsIcon = <View/>,
        blockUserIcon = <View/>;

    if (this.props.viewerIsProfileOwner) {
      editSettingsIcon = <EditSettingsButton/>;
    }
    else {
      blockUserIcon = <BlockUserButton email={this.props.email}/>;
    }

    return (
      <ScrollView style={styles.profileBodyContent}>

        <View style={styles.profileInformationContainer}>
          <CoverImage
            viewerIsProfileOwner={this.props.viewerIsProfileOwner}
            coverImageUrl={'http://www.gobeyondthebrochure.com/wp-content/uploads/2015/05/SUNY-Albany_LevineJ_5ThingsYouMustDo_4.23_FINAL.jpg'}/>

          <View style={styles.profileImageFollowButtonContainer}>
            <ProfileImage
              viewerIsProfileOwner={this.props.viewerIsProfileOwner}
              profileImageUrl={this.props.profileImageUrl}/>
            <FollowButton
              viewerIsProfileOwner={this.props.viewerIsProfileOwner}
              onButtonPress={this._getFollowButtonAction}
              isRequestInFlight={this._isFollowButtonRequestInFlight()}/>
          </View>

          {editSettingsIcon}

          <Text style={styles.fullName}>
            {this.props.firstName + ' ' + this.props.lastName}
          </Text>

          {blockUserIcon}
          <Text style={styles.bio}>
            {this.props.bio}
          </Text>

          <TotalProfileCountsContainer numFans={this.props.numFans} />

        </View>

        <UserPosts
          profileStore={this._getProfileStoreForUserPosts()}
          userName={this.props.firstName + ' ' + this.props.lastName}
          userEmail={this.props.email}
          viewerIsProfileOwner={this.props.viewerIsProfileOwner} />
      </ScrollView>
    );
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
    } else {
      return followUnfollowStore.isRequestInFlight();
    }
  },

  _getAllUsersTheOwnerIsFollowing: function() {
    var userEmail = userLoginMetadataStore.getEmail()
    Unicycle.exec('getFollowing', userEmail);
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
