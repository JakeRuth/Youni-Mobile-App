'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');

var Colors = require('../../Utils/Common/Colors');
var searchStore = require('../../stores/SearchStore');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');

var {
  View,
  TouchableHighlight,
  StyleSheet,
  Text,
  ActionSheetIOS,
  AlertIOS
} = React;

var styles = StyleSheet.create({
  blockUserContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingTop: 27,
    paddingRight: 12,
    paddingLeft: 15,
    paddingBottom: 15
  }
});

var BlockUserButton = React.createClass({

  propTypes: {
    email: React.PropTypes.string.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    return (
      <TouchableHighlight
        onPress={this._onSettingsButtonClick}
        style={styles.blockUserContainer}
        underlayColor='transparent'>

        <View>
          <Icon
            name='android-more-horizontal'
            size={28}
            color={Colors.getPrimaryAppColor()} />
        </View>

      </TouchableHighlight>
    );
  },

  _onSettingsButtonClick: function() {
    ActionSheetIOS.showActionSheetWithOptions({
      options: [
        'Block User',
        'Cancel'
      ],
      destructiveButtonIndex: 0,
      cancelButtonIndex: 1,
      tintColor: Colors.getPrimaryAppColor()
    },
    (buttonIndex) => {
      if (buttonIndex === 0) {
        this._onBlockUserIconPress();
      }
    });
  },

  _onBlockUserIconPress: function () {
    AlertIOS.alert(
      'Are you sure?',
      'You can always unblock a user from the settings button on your profile page.',
      [
        {
          text: 'Yes',
          onPress: this._blockUser
        },
        {
          text: 'No'
        }

      ]
    );
  },

  _blockUser: function () {
    var userId = userLoginMetadataStore.getUserId();

    this.props.navigator.pop();

    AjaxUtils.ajax(
      '/user/block',
      {
        requestingUserIdString: userId,
        userToBlockEmail: this.props.email
      },
      (res) => {
        searchStore.resetSearchResults();
      },
      () => {
        //TODO: Implement fail case
      }
    );
  }

});

module.exports = BlockUserButton;
