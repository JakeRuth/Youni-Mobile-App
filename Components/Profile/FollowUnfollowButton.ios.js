'use strict';

var React = require('react-native');

var Spinner = require('../Common/Spinner');
var PrettyTouchable = require('../Common/PrettyTouchable');

var FollowUnfollowButton = React.createClass({

  propTypes: {
    isFollowing: React.PropTypes.bool,
    followAction: React.PropTypes.func.isRequired,
    unfollowAction: React.PropTypes.func.isRequired
  },

  render: function() {
    // null is meaningful here, it means this button is in a loading state.
    // isFollowing prop will explicitly be true or false to indicate if the user is following or not
    if (this.props.isFollowing === null) {
      return <Spinner/>;
    }
    else {
      return (
        <PrettyTouchable
          label={this._getButtonLabel()}
          containerStyle={{
            width: 146,
            height: 36
          }}
          onPress={this._onButtonPress()}/>
      );
    }
  },

  _getButtonLabel: function() {
    return this.props.isFollowing ? 'Unfollow' : 'Follow';
  },
  
  _onButtonPress: function() {
    if (this.props.isFollowing) {
      return this.props.unfollowAction;
    }
    else {
      return this.props.followAction;
    }
  }

});

module.exports = FollowUnfollowButton;
