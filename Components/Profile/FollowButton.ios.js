'use strict';

var React = require('react-native');
var followStore = require('../../stores/FollowStore');

var {
  View,
  Text,
  StyleSheet,
  ActivityIndicatorIOS
} = React

var styles = StyleSheet.create({
  followingButtonContainer: {
    flex: 3,
    alignItems: 'stretch',
    backgroundColor: 'transparent'
  },
  followingButton: {
    backgroundColor: 'transparent',
    borderColor: '#1599ED',
    color: '#1599ED',
    fontSize: 13,
    fontWeight: '600',
    borderWidth: 1,
    borderRadius: 3,
    padding: 5,
    marginLeft: 6,
    marginRight: 8,
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
      content = this._renderSmallSpinner();
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
  },

  _renderSmallSpinner: function() {
    return (
      <ActivityIndicatorIOS
        size="small"
        color="black"
        animating={true}/>
    )
  }

});

module.exports = FollowingButton;
