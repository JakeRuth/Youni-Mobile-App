'use strict';

var React = require('react');
var ReactNative = require('react-native');

var ProfileInfoSwiper = require('./ProfileInfoSwiper');
var ProfileStat = require('./ProfileStat');
var ProfileImage = require('./ProfileImage');
var ProfileGroups = require('./ProfileGroups');
var GroupThumbnailLink = require('../Group/GroupThumbnailLink');
var CampusScoreInfoAlert = require('../Common/CampusScoreInfoAlert');
var UserFollowingListPopup = require('../PopupPages/UserFollowingListPopup');

var Colors = require('../../Utils/Common/Colors');
var UserFollowRelationshipFilter = require('../../Utils/Enums/UserFollowRelationshipFilter');
var followRelationshipStore = require('../../stores/profile/FollowRelationshipStore');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var {
  Text,
  View,
  StyleSheet,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  topBodyContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  postStatContainer: {
    flex: 3
  },
  profileImageContainer: {
    flex: 4,
    alignItems: 'center'
  },
  bio: {
    color: Colors.DARK_GRAY,
    fontSize: 12,
    textAlign: 'center',
    paddingTop: 10,
    paddingRight: 30,
    paddingLeft: 30
  },
  sidelineDash: {
    position: 'absolute',
    top: 50,
    backgroundColor: Colors.DARK_GRAY,
    height: .5,
    width: 25
  },
  rightDash: {
    right: 0
  },
  leftDash: {
    left: 0
  }
});

var ProfileInfoBody = React.createClass({

  propTypes: {
    user: React.PropTypes.object.isRequired,
    viewerIsProfileOwner: React.PropTypes.bool,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    return (
      <ProfileInfoSwiper>
        {this._renderBasicProfileInfoSlide()}
        {this._renderProfileGroupsSlide()}
      </ProfileInfoSwiper>
    );
  },

  _renderBasicProfileInfoSlide: function() {
    return (
      <View>
        <View style={styles.topBodyContainer}>
          <TouchableHighlight
            style={styles.postStatContainer}
            underlayColor="transparent"
            onPress={() => CampusScoreInfoAlert.show()}>
            <View>
              <ProfileStat
                value={this.props.user.numPosts}
                label="Posts"
                alignIndicatorTo="left"/>
            </View>
          </TouchableHighlight>
          <View style={styles.profileImageContainer}>
            <ProfileImage {...this.props}/>
          </View>
          <TouchableHighlight
            style={styles.postStatContainer}
            underlayColor="transparent"
            onPress={() => {
              if (userLoginMetadataStore.getEmail() === this.props.user.email) {
                followRelationshipStore.setSelectedFilter(UserFollowRelationshipFilter.FANS);
                this.props.navigator.push({
                  component: UserFollowingListPopup
                });
              }
            }}>
            <View>
              <ProfileStat
                value={this.props.user.numFollowers}
                label="Fans"
                alignIndicatorTo="right"/>
            </View>
          </TouchableHighlight>
        </View>
        {this._renderBio()}

        <View style={[styles.sidelineDash, styles.leftDash]}/>
        <View style={[styles.sidelineDash, styles.rightDash]}/>
      </View>
    );
  },

  _renderProfileGroupsSlide: function() {
    return (
      <ProfileGroups {...this.props}>
        <View style={[styles.sidelineDash, styles.leftDash]}/>
        <View style={[styles.sidelineDash, styles.rightDash]}/>
      </ProfileGroups>
    );
  },

  _renderBio: function() {
    if (this.props.user.bio) {
      return (
        <Text style={styles.bio}>
          {this.props.user.bio}
        </Text>
      );
    }
  }

});

module.exports = ProfileInfoBody;
