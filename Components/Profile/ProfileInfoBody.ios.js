'use strict';

var React = require('react-native');

var ProfileStat = require('./ProfileStat');
var ProfileImage = require('./ProfileImage');
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
    justifyContent: 'center',
    padding: 10
  },
  postStatContainer: {
    flex: 2
  },
  profileImageContainer: {
    flex: 3,
    alignItems: 'center'
  },
  bio: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '100',
    marginBottom: 30,
    paddingTop: 10,
    paddingRight: 30,
    paddingLeft: 30
  }
});

var ProfileInfoBody = React.createClass({

  propTypes: {
    viewerIsProfileOwner: React.PropTypes.bool,
    profileImageUrl: React.PropTypes.string,
    bio: React.PropTypes.string,
    numFans: React.PropTypes.number.isRequired,
    campusScore: React.PropTypes.any.isRequired
  },

  render: function() {
    return (
      <View>
        <View style={styles.topBodyContainer}>
          <View style={styles.postStatContainer}>
            <ProfileStat
              value={this.props.campusScore}
              label="Campus Score"
              alignIndicatorTo="left"/>
          </View>
          <View style={styles.profileImageContainer}>
            <ProfileImage {...this.props}/>
          </View>
          <View style={styles.postStatContainer}>
            <ProfileStat
              value={this.props.numFans}
              label="Fans"
              alignIndicatorTo="right"/>
          </View>
        </View>
        {this._renderBio()}
      </View>
    );
  },

  _renderBio: function() {
    if (this.props.bio) {
      return (
        <Text style={styles.bio}>
          {this.props.bio}
        </Text>
      );
    }
  }

});

module.exports = ProfileInfoBody;
