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
} = React

var styles = StyleSheet.create({
  blockUserContainer: {
    position: 'absolute',
    top: 0,
    right: 6,
    paddingBottom: 8,
    paddingLeft: 8
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
            name='alert-circled'
            size={20}
            color={'#FF7878'} />
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
        searchStore.resetSearchPageAfterBlockingUser();
      },
      () => {
        //TODO: Implement fail case
      }
    );
  }

});

module.exports = BlockUserButton;
