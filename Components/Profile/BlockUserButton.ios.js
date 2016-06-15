'use strict';

var React = require('react-native');
var searchStore = require('../../stores/SearchStore');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var Icon = require('react-native-vector-icons/Ionicons');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');

var {
  View,
  TouchableHighlight,
  StyleSheet,
  Text,
  AlertIOS
} = React;

var styles = StyleSheet.create({
  blockUserContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingTop: 22,
    paddingRight: 12,
    paddingLeft: 15,
    paddingBottom: 15
  }
});

var BlockUserButton = React.createClass({

  propTypes: {
    email: React.PropTypes.string.isRequired
  },

  render: function() {
    return (
      <TouchableHighlight
        onPress={this._onBlockUserIconPress}
        style={styles.blockUserContainer}
        underlayColor='transparent'>

        <View>
          <Icon
            name='android-more-horizontal'
            size={28}
            color='white' />
        </View>

      </TouchableHighlight>
    );
  },

  _onBlockUserIconPress: function () {
    AlertIOS.alert(
      'Permanently block this user?',
      'You can always unblock users from the settings page',
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
