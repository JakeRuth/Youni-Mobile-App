'use strict';

var React = require('react-native');

var ProfileInfoBody = require('./ProfileInfoBody');
var ProfileInfoFooter = require('./ProfileInfoFooter');

var Colors = require('../../Utils/Common/Colors');
var PostViewType = require('../../Utils/Enums/PostViewType');

var {
  View,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.YOUNI_PRIMARY
  }
});

var ProfileInfo = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired,
    user: React.PropTypes.object.isRequired,
    isFollowing: React.PropTypes.bool,
    followAction: React.PropTypes.func,
    unfollowAction: React.PropTypes.func,
    currentPostViewMode: React.PropTypes.oneOf([PostViewType.GRID, PostViewType.LIST]).isRequired,
    onPostViewControlPress: React.PropTypes.func.isRequired,
    viewerIsProfileOwner: React.PropTypes.bool
  },

  render: function() {
    return (
      <View style={styles.container}>

        <ProfileInfoBody {...this.props}/>
        <ProfileInfoFooter {...this.props}/>

      </View>
    );
  }

});

module.exports = ProfileInfo;
