'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Unicycle = require('../../../Unicycle');
var ProfileImageThumbnail = require('../../Common/ProfileImageThumbnail');
var userLoginMetadataStore = require('../../../stores/UserLoginMetadataStore');
var Colors = require('../../../Utils/Common/Colors');

var {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  blockedUserContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    height: 65,
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 16,
    marginRight: 16
  },
  blockedUserName: {
    paddingLeft: 10,
    color: Colors.DARK_GRAY,
    fontSize: 16
  },
  unblockButtonContainer: {
    position: 'absolute',
    top: 20,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: 75,
    height: 27,
    borderWidth: 1,
    borderRadius: 6
  },
  unblockButtonText: {
    fontSize: 14
  },
  noBlockedUsersMessage: {
    color: Colors.DARK_GRAY,
    padding: 20,
    textAlign: 'center'
  }
});

var BlockedUsersPage = React.createClass({

  propTypes: {
    users: React.PropTypes.object.isRequired
  },

  render: function() {
    var content;

    if (this.props.users.size > 0) {
      content = this._renderBlockedUsersList(this.props.users);
    }
    else {
      content = this._renderNoBlockedUsersMessage();
    }

    return (
      <View style={styles.container}>
        {content}
      </View>
    );
  },

  _renderBlockedUsersList: function(blockedUsers) {
    var userListItems = [];

    for (var i = 0; i < blockedUsers.size; i++) {
      userListItems.push(this._renderBlockedUser(blockedUsers.get(i)));
    }

    return (
      <ScrollView
        style={styles.container}
        automaticallyAdjustContentInsets={false}>
        {userListItems}
      </ScrollView>
    );
  },

  _renderBlockedUser: function(user) {
    return (
      <View
        style={styles.blockedUserContainer}
        key={user.get('id')}>

        <ProfileImageThumbnail profileImageUrl={user.get('profileImageUrl')}/>
        <Text style={styles.blockedUserName}>
          {user.get('firstName')} {user.get('lastName')}
        </Text>
        {this._renderUnblockUserButton(user)}

      </View>
    );
  },

  _renderUnblockUserButton: function(user) {
    return (
      <TouchableHighlight
        style={[styles.unblockButtonContainer, { borderColor: Colors.getPrimaryAppColor() }]}
        underlayColor="transparent"
        onPress={() => { this._onUnBlockButtonPress(user); }}>
        <Text style={[styles.unblockButtonText, { color: Colors.getPrimaryAppColor() }]}>
          Unblock
        </Text>
      </TouchableHighlight>
    )
  },

  _renderNoBlockedUsersMessage: function() {
    return (
      <Text style={styles.noBlockedUsersMessage}>
        You have not blocked anyone
      </Text>
    );
  },

  _onUnBlockButtonPress: function(user) {
    var loggedInUserId = userLoginMetadataStore.getUserId();
    // user 'id' here is just the index of the user in the list.
    Unicycle.exec('removeBlock', user.get('id'), loggedInUserId, user.get('email'));
  }

});

module.exports = BlockedUsersPage;
