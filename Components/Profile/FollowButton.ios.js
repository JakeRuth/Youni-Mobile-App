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
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: 'transparent'
  },
  followingButton: {
    backgroundColor: 'transparent',
    borderColor: '#5375FA',
    color: '#5375FA',
    fontSize: 18,
    fontWeight: '600',
    borderWidth: 1,
    borderRadius: 1,
    padding: 5,
    marginLeft: 5,
    marginRight: 5,
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
