'use strict';

var React = require('react-native');
var followStore = require('../../stores/FollowStore');
var Spinner = require('../Common/Spinner');

var {
  View,
  Text,
  StyleSheet
} = React

var styles = StyleSheet.create({
  followingButtonContainer: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: 'transparent'
  },
  followingButton: {
    borderColor: '#0083D4',
    color: '#0083D4',
    fontSize: 13,
    fontWeight: '600',
    borderWidth: 1,
    borderRadius: 2,
    padding: 5,
    marginLeft: 6,
    marginRight: 6,
    textAlign: 'center'
  }
});

var FollowingButton = React.createClass({

  propTypes: {
    isRequestInFlight: React.PropTypes.bool.isRequired,
    onButtonPress: React.PropTypes.func.isRequired,
    viewerIsProfileOwner: React.PropTypes.bool.isRequired
  },

  render: function() {
    var content;
    if (this.props.isRequestInFlight) {
      content = (
        <Spinner/>
      );
    }
    else {
      content = this._renderButton();
    }

    return (
      <View style={styles.followingButtonContainer}>
        {content}
      </View>
    );
  },

  _renderButton: function() {
    return (
      <Text style={styles.followingButton} onPress={this.props.onButtonPress}>
        {this._getButtonLabel()}
      </Text>
    );
  },

  _getButtonLabel: function() {
    if (this.props.viewerIsProfileOwner) {
      return 'Following';
    }
    else {
      return followStore.getIsUserFollowingResult() ? 'Unfollow' : 'Follow';
    }
  }

});

module.exports = FollowingButton;
