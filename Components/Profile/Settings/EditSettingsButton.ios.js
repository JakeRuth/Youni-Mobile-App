'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');
var Unicycle = require('../../../Unicycle');

var EditProfilePopup = require('../../PopupPages/EditProfilePopup');
var BlockedUsersPopup = require('../../PopupPages/BlockedUsersPopup');

var AsyncStorageUtils = require('../../../Utils/Common/AsyncStorageUtils');
var Colors = require('../../../Utils/Common/Colors');
var IosStatusBarStyles = require('../../../Utils/Common/IosStatusBarStyles');
var statusBarStyleStore = require('../../../stores/StatusBarStyleStore');

var {
  View,
  TouchableHighlight,
  StyleSheet,
  ActionSheetIOS,
  AlertIOS
} = ReactNative;

var styles = StyleSheet.create({
  settingIconContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingTop: 25,
    paddingRight: 12,
    paddingLeft: 15,
    paddingBottom: 15
  }
});

var EditSettingsButton = React.createClass({

  propTypes: {
    user: React.PropTypes.object.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    return (
      <TouchableHighlight
        onPress={this._onSettingsButtonClick}
        style={styles.settingIconContainer}
        underlayColor='transparent'>

        <Icon
          name='settings'
          size={30}
          color={Colors.getPrimaryAppColor()}/>

      </TouchableHighlight>
    );
  },

  _onSettingsButtonClick: function() {
    ActionSheetIOS.showActionSheetWithOptions({
      options: [
        'Edit Profile',
        'Blocked Users',
        'Logout',
        'Cancel'
      ],
      destructiveButtonIndex: 2,
      cancelButtonIndex: 3,
      tintColor: Colors.getPrimaryAppColor()
    },
    (buttonIndex) => {
      if (buttonIndex === 0) {
        this._onEditProfileOptionSelect();
      }
      else if (buttonIndex === 1) {
        this._onShowBlockedUsersOptionSelect();
      }
      else if (buttonIndex === 2) {
        this._onLogoutButtonPressAreYouSurePrompt();
      }
    });
  },

  _onEditProfileOptionSelect: function() {
    this.props.navigator.push({
      component: EditProfilePopup,
      passProps: {
        user: this.props.user
      }
    });
  },

  _onShowBlockedUsersOptionSelect: function() {
    this.props.navigator.push({
      component: BlockedUsersPopup
    });
  },

  _onLogoutButtonPressAreYouSurePrompt: function() {
    AlertIOS.alert(
      '',
      'Are you sure you want Logout?',
      [
        {
          text: 'Yes',
          onPress: this._onConfirmLogoutPress
        },
        {
          text: 'No'
        }
      ]
    );
  },

  _onConfirmLogoutPress: function() {
    AsyncStorageUtils.removeItem('password');
    Unicycle.exec('refreshHomeFeedData');
    Unicycle.exec('refreshExploreFeedData');
    Unicycle.exec('reInitProfilePageState');

    statusBarStyleStore.setStyle(IosStatusBarStyles.LIGHT_CONTENT);
    this.props.navigator.popToTop();
  }

});

module.exports = EditSettingsButton;
