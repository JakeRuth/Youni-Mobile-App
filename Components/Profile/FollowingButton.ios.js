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
    marginTop: -40,
    marginRight: 10,
    backgroundColor: 'white',
    alignSelf: 'flex-end'
  },
  followingButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderColor: '#5375FA',
    color: '#5375FA',
    fontSize: 18,
    fontWeight: '600',
    borderWidth: 1,
    borderRadius: 1,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 45,
    paddingRight: 45
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
