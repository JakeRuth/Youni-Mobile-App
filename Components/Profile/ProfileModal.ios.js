'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var profileModalStore = require('../../stores/profile/ProfileModalStore');
var profileStore = require('../../stores/profile/ProfileStore');
var ProfilePageBody = require('./ProfilePageBody');
var MainScreenBanner = require('../../MainScreenBanner');
var Spinner = require('../Common/Spinner');

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
  }
});

var ProfileModal = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

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
      content = (
        <Spinner/>
      );
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

            <MainScreenBanner
              title={profileStore.getFirstName() + ' ' + profileStore.getLastName()}/>
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
        viewerIsProfileOwner={false}
        firstName={profileStore.getFirstName()}
        lastName={profileStore.getLastName()}
        bio={profileStore.getBio()}
        numFans={profileStore.getNumFollowers()}
        totalPoints={profileStore.getTotalPoints()}
        profileImageUrl={profileStore.getProfileImageUrl()}
        email={profileStore.getEmail()}
        numPosts={profileStore.getNumPosts()}
        navigator={this.props.navigator}/>
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
  }

});

module.exports = ProfileModal;
