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
    position: 'absolute',
    right: 10,
    top: 290,
    left: 198
  },
  followingButton: {
    backgroundColor: 'white',
    borderColor: '#5375FA',
    color: '#5375FA',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    borderWidth: 1,
    borderRadius: 1,
    paddingTop: 5,
    paddingBottom: 5
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
