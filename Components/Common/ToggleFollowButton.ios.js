'use strict';

var React = require('react');
var ReactNative = require('react-native');

var Spinner = require('./Spinner');
var PrettyTouchable = require('./PrettyTouchable');

var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var AjaxUtils = require('../../Utils/Common/AjaxUtils');

var {
  View,
  AlertIOS,
  StyleSheet,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    width: 95,
    height: 34
  },
  buttonContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

var ToggleFollowButton = React.createClass({

  propTypes: {
    user: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      isFollowing: this.props.user.isFollowing,
      isRequestInFlight: false
    };
  },

  render: function() {
    var content;

    if (userLoginMetadataStore.getEmail() === this.props.user.email) {
      return <View/>;
    }
    else if (this.state.isRequestInFlight) {
      content = <Spinner/>;
    }
    else {
      content = (
        <PrettyTouchable
          label={this._getButtonLabel()}
          containerStyle={{
            height: 34,
            width: 95
          }}
          invertColors={!this.state.isFollowing}
          onPress={this._onPress}/>
      );
    }

    return (
      <TouchableHighlight
        style={[styles.container, this.props.style]}
        underlayColor='transparent'
        onPress={this._onPress}>
        <View style={styles.buttonContent}>
          {content}
        </View>
      </TouchableHighlight>
    );
  },

  _getButtonLabel: function() {
    if (this.state.isFollowing) {
      return 'Following';
    }
    else {
      return 'Follow';
    }
  },

  _onPress: function() {
    if (this.state.isFollowing) {
      AlertIOS.alert(
        `Are you sure you want to unfollow ${this.props.user.firstName}?`,
        '',
        [
          {
            text: 'Yes',
            onPress: this._removeFollow
          },
          {
            text: 'No'
          }
        ]
      );
    }
    else {
      this._follow();
    }
  },

  _follow: function() {
    var userId = userLoginMetadataStore.getUserId(),
        that = this;

    this.setState({
      isRequestInFlight: true
    });

    AjaxUtils.ajax(
      '/user/follow',
      {
        requestingUserIdString: userId,
        userToFollowEmail: this.props.user.email
      },
      (res) => {
        that.setState({
          isRequestInFlight: false,
          isFollowing: true
        });
      },
      () => {
        that.setState({
          isRequestInFlight: false
        });
      },
      true // do not retry request
    );
  },

  _removeFollow: function() {
    var userId = userLoginMetadataStore.getUserId(),
        that = this;

    this.setState({
      isRequestInFlight: true
    });

    AjaxUtils.ajax(
      '/user/removeFollow',
      {
        requestingUserIdString: userId,
        userToNotFollowEmail: this.props.user.email
      },
      (res) => {
        that.setState({
          isRequestInFlight: false,
          isFollowing: false
        });
      },
      () => {
        that.setState({
          isRequestInFlight: false
        });
      },
      true // do not retry request
    );
  }

});

module.exports = ToggleFollowButton;
