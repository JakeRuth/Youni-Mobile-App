'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var getAllFollowingStore = require('../../stores/user/GetAllFollowingStore');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} = React

var styles = StyleSheet.create({
  followingButtonContainer: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 50
  },
  followingButton: {
    backgroundColor: 'rgba(0,124,158,.2)',
    fontSize: 20,
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    paddingRight: 10,
    paddingLeft: 10
  }
});

var FollowingButton = React.createClass({

  render: function() {
    return (
      <View style={styles.followingButtonContainer}>
        <Text style={styles.followingButton} onPress={this.onFollowingButtonPress}>
          Following
        </Text>
      </View>
    );
  },

  onFollowingButtonPress: function() {
    var userEmail = userLoginMetadataStore.getEmail()
    Unicycle.exec('getFollowing', userEmail);
  }

});

module.exports = FollowingButton;
