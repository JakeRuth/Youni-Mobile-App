'use strict';

var React = require('react-native');
var followUnfollowStore = require('../../stores/FollowStore');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var Unicycle = require('../../Unicycle');

var {
  View,
  Text,
  StyleSheet,
  ActivityIndicatorIOS
} = React

var styles = StyleSheet.create({
  followUnfollowContainer: {
      flex: 1,
      alignItems: 'center'
  },
  followUnfollowButton: {
    backgroundColor: 'rgba(0,124,158,.2)',
    fontSize: 20,
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    paddingRight: 10,
    paddingLeft: 10
  }
});

var FollowUnfollowButton = React.createClass({

  propTypes: {
    email: React.PropTypes.string.isRequired
  },

  mixins: [
    Unicycle.listenTo(followUnfollowStore),
    Unicycle.listenTo(userLoginMetadataStore)
  ],

  componentDidMount: function() {
    var userId = userLoginMetadataStore.getUserId();
    Unicycle.exec('isUserFollowing', userId, this.props.email);
  },

  render: function() {
    var isRequestInFlight = followUnfollowStore.isRequestInFlight();
    var content;

    if (isRequestInFlight) {
      content = <ActivityIndicatorIOS/>;
    }
    else {
      var isUserFollowingText = followUnfollowStore.getIsUserFollowingResult() ? 'Unfollow' : 'Follow';
      content = (
        <Text style={styles.followUnfollowButton} onPress={this._buttonOnClickAction(isUserFollowingText)}>
          {isUserFollowingText}
        </Text>
      );
    }

    return (
      <View style={styles.followUnfollowContainer}>
        {content}
      </View>
    );
  },

  _buttonOnClickAction: function(isFollowing) {
    var userId = userLoginMetadataStore.getUserId();
    if (isFollowing == 'Follow') {
      return () => {
        Unicycle.exec('follow', userId, this.props.email);
      }
    }
    else {
      return () => {
        Unicycle.exec('unfollow', userId, this.props.email);
      }
    }
  }

});

module.exports = FollowUnfollowButton;
