'use strict';

var React = require('react-native');
var FollowUnfollowButton = require('./FollowUnfollowButton');
var FollowingButton = require('./FollowingButton');
var EditSettingsButton = require('./Settings/EditSettingsButton');
var BlockUserButton = require('./BlockUserButton');
var ProfileImage = require('./ProfileImage');
var CoverImage = require('./CoverImage');
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
    flex: 1,
    flexDirection: 'column'
  },
  profileBodyFirstBlock: {
    flex: .25,
    backgroundColor: 'red'
  },
  profileBodySecondBlock: {
    flex: .25,
    backgroundColor: 'green'
  },
  statusBadge: {
    flex: 1,
    flexDirection: 'row'
  },
  statusBadgeNumPosts: {
    flex: .5,
    borderRightWidth: 1,
    borderColor: 'grey'
  },
  statusBadgeNumFans: {
    flex: .5
  },
  statusBadgeText: {
    color: 'grey',
    textAlign: 'center'
  },
  statusBadgeNum: {
    color: '#5375FA',
    textAlign: 'center',
    fontSize: 25,
    fontWeight: '600'
  },
  fullName: {
    fontSize: 30,
    left: 20,
    backgroundColor: 'transparent'
  },
  postCount: {
    textAlign: 'left',
    fontSize: 30,
    fontWeight: '800'
  },
  fanCount: {
    textAlign: 'right',
    fontSize: 30,
    fontWeight: '800'
  },
  bio: {
    color: 'grey',
    alignSelf: 'auto',
    margin: 20
  },
  blankLine: {
    borderWidth: 1,
    borderColor: 'lightgray'
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
          <CoverImage
            viewerIsProfileOwner={this.props.viewerIsProfileOwner}
            coverImageUrl={'http://www.gobeyondthebrochure.com/wp-content/uploads/2015/05/SUNY-Albany_LevineJ_5ThingsYouMustDo_4.23_FINAL.jpg'}/>
          <ProfileImage
            viewerIsProfileOwner={this.props.viewerIsProfileOwner}
            profileImageUrl={this.props.profileImageUrl}/>
          {editSettingsIcon}
          {seeWhoImFollowingButton}

          <View style={styles.blankLine}/>
            <View style={styles.statusBadge}>
              <View style={styles.statusBadgeNumPosts}>
                <Text style={styles.statusBadgeText}>Posts</Text>
                <Text style={styles.statusBadgeNum}>43</Text>
              </View>
              <View style={styles.statusBadgeNumFans}>
                <Text style={styles.statusBadgeText}>Fans</Text>
                <Text style={styles.statusBadgeNum}>{this.props.numFans}</Text>
              </View>
            </View>
          <View style={styles.blankLine}/>

          <Text style={styles.fullName}>{fullName}</Text>

          {blockUserIcon}
          <Text style={styles.bio}>{this.props.bio}</Text>


          <Text style={styles.fanCount}>{this._getFansText(this.props.numFans)}</Text>
          {followButton}

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
