'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var profileModalStore = require('../../stores/profile/ProfileModalStore');
var profileStore = require('../../stores/profile/ProfileStore');
var ProfilePageBody = require('./ProfilePageBody');

var {
  View,
  Text,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  ActivityIndicatorIOS
} = React

var styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
    paddingBottom: 10
  },
  closeModalButton: {
    alignSelf: 'center',
    backgroundColor: '#FF7878',
    marginTop: 10,
    padding: 10,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 3
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

var ProfileModal = React.createClass({

  mixins: [
    Unicycle.listenTo(profileModalStore),
    Unicycle.listenTo(profileStore)
  ],

  _setModalVisibility(isVisible) {
    Unicycle.exec('setProfileModalVisibile', isVisible);
  },

  render: function() {
    var isRequestInFlight = profileStore.isRequestInFlight(),
        isModalVisible = profileModalStore.getIsVisible(),
        content;

    if (isRequestInFlight) {
      content = this._renderSmallSpinner();
    }
    else {
      content = this._renderModalContent();
    }

    return (
      <View>
        <Modal
          animated={false}
          visible={isModalVisible}>

          <View style={styles.container}>

            {content}
            {this._renderCloseModalButton()}

          </View>

        </Modal>
      </View>
    );
  },

  _renderModalContent: function() {
    return (
      <ProfilePageBody
        viewerIsProfileOwner = {false}
        firstName = {profileStore.getFirstName()}
        lastName = {profileStore.getLastName()}
        bio = {profileStore.getBio()}
        numFans = {profileStore.getNumFollowers()}
        profileImageUrl = {profileStore.getProfileImageUrl()}
        email = {profileStore.getEmail()}
      />
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

  _renderSmallSpinner: function() {
    return (
      <View style={styles.spinnerContainer}>
        <ActivityIndicatorIOS
          size="small"
          color="black"
          animating={true} />
      </View>
    );
  }

});

module.exports = ProfileModal;
