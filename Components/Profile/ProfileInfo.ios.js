'use strict';

var React = require('react-native');

var ProfileInfoBody = require('./ProfileInfoBody');
var ProfileInfoFooter = require('./ProfileInfoFooter');

var Colors = require('../../Utils/Common/Colors');

var {
  View,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.YOUNI_PRIMARY_PURPLE
  }
});

var ProfileInfo = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired,
    user: React.PropTypes.object.isRequired,
    isFollowing: React.PropTypes.bool,
    followAction: React.PropTypes.func,
    unfollowAction: React.PropTypes.func,
    viewerIsProfileOwner: React.PropTypes.bool
  },

  render: function() {
    return (
      <View style={styles.container}>

        <ProfileInfoBody
          viewerIsProfileOwner={this.props.viewerIsProfileOwner}
          profileImageUrl={this.props.user.profileImageUrl}
          bio={this.props.user.bio}
          numFans={this.props.user.numFollowers}
          campusScore={this.props.user.totalPoints}/>
        <ProfileInfoFooter {...this.props}/>

      </View>
    );
  }

});

module.exports = ProfileInfo;
