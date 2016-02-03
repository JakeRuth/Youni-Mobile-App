'use strict';

var React = require('react-native');
var Unicycle = require('../../../Unicycle');
var editProfileInformationStore = require('../../../stores/profile/EditProfileInformationStore');
var userLoginMetadataStore = require('../../../stores/UserLoginMetadataStore');
var Spinner = require('../../Common/Spinner');

var {
  View,
  Text,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableHighlight
} = React

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    paddingTop: 25,
    paddingBottom: 10
  },
  modalContainer: {
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 10,
    margin: 10
  },
  modalHeader: {
    color: 'darkgray',
    alignSelf: 'center'
  },
  likerListContainer: {
    alignItems: 'center'
  },
  likerListScroll: {
    margin: 20,
    padding: 20,
    height: 200
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
  },
  closeModalButton: {
    alignSelf: 'center',
    backgroundColor: '#FF7878',
    marginTop: 10,
    padding: 10,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 3
  }
});

var BlockedUsersModal = React.createClass({

  mixins: [
    Unicycle.listenTo(editProfileInformationStore)
  ],

  _setModalVisibility(isVisible) {
    Unicycle.exec('setBlockedUsersModalVisible', isVisible);
  },

  render: function() {
    var isModalVisible = editProfileInformationStore.isBlockedUsersModalVisible(),
        isRequestInFlight = editProfileInformationStore.isGetBlockedUsersRequestInFlight(),
        isRemoveBlockRequestInFlight = editProfileInformationStore.isRemoveBlockRequestInFlight(),
        blockedUsers =  editProfileInformationStore.getBlockedUsers(),
        content;

    if (isRequestInFlight || isRemoveBlockRequestInFlight) {
      content = (
          <Spinner
            color={'black'}/>
        );
    }
    else if (blockedUsers.size != 0) {
      content = this._renderModalContent(blockedUsers);
    }
    else {
      content = this._renderNoBlockedUsersMessage();
    }

    return (
      <View>
        <Modal
          animated={false}
          transparent={true}
          visible={isModalVisible}>

          <View style={styles.container}>

            <View style={styles.modalContainer}>
              {content}
            </View>
            {this._renderCloseModalButton()}

          </View>

        </Modal>
      </View>
    );
  },

  _renderModalContent: function(blockedUsers) {
    return (
      <View>
        <Text style={styles.modalHeader}>Users you have blocked.</Text>

        <ScrollView style={styles.likerListScroll}>
          <View style={styles.likerListContainer}>
            {this._renderBlockedUsers(blockedUsers)}
          </View>
        </ScrollView>
      </View>
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
            this._onUnBlockButtonPress(user.get('email'));
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

  _renderCloseModalButton: function() {
    return (
      <TouchableHighlight
        onPress={() => {this._setModalVisibility(false)}}
        style={styles.closeModalButton}>
        <Text>Close</Text>
      </TouchableHighlight>
    );
  },

  _onUnBlockButtonPress: function(userToUnBlockEmail) {
    var userId = userLoginMetadataStore.getUserId();
    Unicycle.exec('removeBlock', userId, userToUnBlockEmail);
  }

});

module.exports = BlockedUsersModal;
