'use strict';

var React = require('react');
var ReactNative = require('react-native');

var ProfileInfoBody = require('./ProfileInfoBody');
var ProfileInfoFooter = require('./ProfileInfoFooter');

var Colors = require('../../Utils/Common/Colors');
var PostViewType = require('../../Utils/Enums/PostViewType');

var {
  View,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    marginTop: 10
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
