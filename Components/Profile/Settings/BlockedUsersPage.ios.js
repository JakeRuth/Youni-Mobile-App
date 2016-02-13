'use strict';

var React = require('react-native');
var Unicycle = require('../../../Unicycle');
var editProfileInformationStore = require('../../../stores/profile/EditProfileInformationStore');
var userLoginMetadataStore = require('../../../stores/UserLoginMetadataStore');
var Spinner = require('../../Common/Spinner');

var {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 15
  },
  likerListScroll: {
    margin: 20,
    padding: 20
  },
  blockedUserContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  blockedUserFullName: {
    fontSize: 15
  },
  removeBlockButton: {
    marginRight: 15,
    fontSize: 15,
    color: '#FF7878',
    padding: 5,
    margin: 3,
    borderWidth: 1,
    borderColor: '#FF7878'
  }
});

var BlockedUsersPage = React.createClass({

  mixins: [
    Unicycle.listenTo(editProfileInformationStore)
  ],

  render: function() {
    var isRequestInFlight = editProfileInformationStore.isGetBlockedUsersRequestInFlight(),
        isRemoveBlockRequestInFlight = editProfileInformationStore.isRemoveBlockRequestInFlight(),
        blockedUsers =  editProfileInformationStore.getBlockedUsers(),
        content;

    if (isRequestInFlight || isRemoveBlockRequestInFlight) {
      content = (
        <Spinner/>
      );
    }
    else if (blockedUsers.size != 0) {
      content = this._renderModalContent(blockedUsers);
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

  _renderModalContent: function(blockedUsers) {
    return (
      <ScrollView style={styles.likerListScroll}>
        {this._renderBlockedUsers(blockedUsers)}
      </ScrollView>
    );
  },

  _renderBlockedUsers: function(blockedUsers) {
    var userListItems = [];

    for (var i = 0; i < blockedUsers.size; i++) {
      var user = blockedUsers.get(i);
      userListItems.push(this._renderBlockedUser(user));
    }

    return (
      <View>
        {userListItems}
      </View>
    );
  },

  _renderBlockedUser: function(user) {
    return (
      <View style={styles.blockedUserContainer}>

        <TouchableHighlight
          underlayColor='transparent'
          onPress={() => {
            this._onUnBlockButtonPress(user);
          }}>

          <Text style={styles.removeBlockButton}>
            Unblock
          </Text>

        </TouchableHighlight>

        <Text style={styles.blockedUserFullName}>
          {user.get('firstName')} {user.get('lastName')}
        </Text>

      </View>
    );
  },

  _renderNoBlockedUsersMessage: function() {
    return (
      <Text>You have not blocked anyone.</Text>
    );
  },

  _onUnBlockButtonPress: function(user) {
    var userId = userLoginMetadataStore.getUserId();
    // user 'id' here is just the index of the user in the list.
    Unicycle.exec('removeBlock', user.get('id'), userId, user.get('email'));
  }

});

module.exports = BlockedUsersPage;
