'use strict';

var React = require('react-native');

var ProfileInfoSwiper = require('./ProfileInfoSwiper');
var ProfileStat = require('./ProfileStat');
var ProfileImage = require('./ProfileImage');
var ProfileGroups = require('./ProfileGroups');
var GroupThumbnailLink = require('../Group/GroupThumbnailLink');

var Colors = require('../../Utils/Common/Colors');

var {
  Text,
  View,
  StyleSheet
} = React;

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
    fontWeight: '100',
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
          <View style={styles.postStatContainer}>
            <ProfileStat
              value={this.props.user.totalPoints}
              label="Campus Score"
              alignIndicatorTo="left"/>
          </View>
          <View style={styles.profileImageContainer}>
            <ProfileImage {...this.props}/>
          </View>
          <View style={styles.postStatContainer}>
            <ProfileStat
              value={this.props.user.numFollowers}
              label="Fans"
              alignIndicatorTo="right"/>
          </View>
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
