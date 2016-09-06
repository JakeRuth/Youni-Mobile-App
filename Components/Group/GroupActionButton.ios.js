'use strict';

var React = require('react');
var ReactNative = require('react-native');

var Spinner = require('../Common/Spinner');

var Colors = require('../../Utils/Common/Colors');
var UserGroupStatus = require('../../Utils/Enums/UserGroupStatus');

var {
  Text,
  View,
  StyleSheet,
  AlertIOS,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: 193,
    height: 40,
    borderRadius: 6
  },
  buttonLabel: {
    flex: 1,
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    alignSelf: 'center'
  }
});

var GroupActionButton = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired,
    group: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired,
      abbreviatedName: React.PropTypes.string.isRequired,
      description: React.PropTypes.string.isRequired,
      coverImageUrl: React.PropTypes.string.isRequired,
      badgeImageUrl: React.PropTypes.string.isRequired,
      adminEmails: React.PropTypes.array,
      allTimeTrendPoints: React.PropTypes.number.isRequired,
      numPosts: React.PropTypes.number.isRequired,
      numMembers: React.PropTypes.number.isRequired
    }).isRequired,
    userGroupStatus: React.PropTypes.oneOf([
      UserGroupStatus.IN_GROUP,
      UserGroupStatus.REQUEST_TO_JOIN_DECLINED,
      UserGroupStatus.REQUEST_TO_JOIN_PENDING,
      UserGroupStatus.NOT_IN_GROUP
    ]),
    requestToJoinGroupAction: React.PropTypes.func.isRequired,
    isLoading: React.PropTypes.bool
  },

  render: function () {
    if (this._shouldHideButton()) {
      return <View/>;
    }
    else if (this.props.isLoading) {
      return (
        <View style={styles.container}>
          <Spinner/>
        </View>
      );
    }
    else {
      return (
        <TouchableHighlight
          underlayColor="transparent"
          onPress={this._onButtonPress}>
          <View style={this._getContainerStyles()}>
            <Text style={this._getButtonStyles()}>
              {this.props.userGroupStatus.label}
            </Text>
          </View>
        </TouchableHighlight>
      );
    }
  },

  _onButtonPress: function() {
    if (this.props.userGroupStatus === UserGroupStatus.REQUEST_TO_JOIN_DECLINED) {
      this._alertRequestWasDenied();
    }
    else if (this.props.userGroupStatus === UserGroupStatus.REQUEST_TO_JOIN_PENDING) {
      this._alertRequestIsPending();
    }
    else {
      this._alertRequestToJoinGroup();
    }
  },

  _alertRequestWasDenied: function() {
    AlertIOS.alert(
      'Your request to join this group was declined.',
      '',
      {
        text: 'Okay'
      }
    );
  },

  _alertRequestIsPending: function() {
    AlertIOS.alert(
      'Your request to join is pending.',
      'An admin of this group will either accept or deny this request, you will be notified of their response.',
      {
        text: 'Okay'
      }
    );
  },

  _alertRequestToJoinGroup: function() {
    AlertIOS.alert(
      'Are you are you want to request to join this group?',
      '',
      [
        {
          text: 'Yes',
          onPress: this.props.requestToJoinGroupAction
        },
        {
          text: 'No'
        }
      ]
    );
  },
  
  _shouldHideButton: function() {
    return this.props.userGroupStatus === UserGroupStatus.IN_GROUP ||
           this.props.group.isPublic ||
           !this.props.group.allowJoinRequests;
  },

  _getContainerStyles: function() {
    var containerStyles = [styles.container];

    if (this.props.userGroupStatus === UserGroupStatus.REQUEST_TO_JOIN_PENDING) {
      containerStyles.push({ backgroundColor: Colors.getPrimaryAppColor() });
    }
    else if (this.props.userGroupStatus === UserGroupStatus.NOT_IN_GROUP) {
      containerStyles.push({
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: Colors.getPrimaryAppColor()
      });
    }
    else {
      containerStyles.push({ backgroundColor: Colors.LIGHT_GRAY });
    }

    return containerStyles;
  },

  _getButtonStyles: function() {
    var buttonStyles = [styles.buttonLabel];

    if (this.props.userGroupStatus === UserGroupStatus.NOT_IN_GROUP) {
      buttonStyles.push({ color: Colors.getPrimaryAppColor() });
    }
    else if (this.props.userGroupStatus === UserGroupStatus.REQUEST_TO_JOIN_DECLINED) {
      buttonStyles.push({ color: Colors.MED_GRAY });
    }

    return buttonStyles;
  }

});

module.exports = GroupActionButton;
