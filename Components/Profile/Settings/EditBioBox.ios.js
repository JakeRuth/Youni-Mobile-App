'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Unicycle = require('../../../Unicycle');
var profileOwnerStore = require('../../../stores/profile/ProfileOwnerStore');
var editProfileInformationStore = require('../../../stores/profile/EditProfileInformationStore');
var userLoginMetadataStore = require('../../../stores/UserLoginMetadataStore');
var SubmitActionButtons = require('./SubmitActionButtons');
var Spinner = require('../../Common/Spinner');

var {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  updateBioContainer: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    margin: 5,
    padding: 10
  },
  updateBioText: {
    flex: 2,
    textAlign: 'center',
    fontSize: 15,
    padding: 5
  },
  updateBioInput: {
    flex: 5,
    backgroundColor: 'white',
    padding: 15,
    paddingTop: 3,
    height: 75,
    borderWidth: 1,
    borderRadius: 3
  }
});

var EditBioBox = React.createClass({

  getInitialState: function() {
    return {
      originalBio: profileOwnerStore.getBio()
    };
  },

  render: function() {
    var isUploadBioRequestInFlight = editProfileInformationStore.isUploadBioRequestInFlight(),
        actionButtons;

    if (isUploadBioRequestInFlight) {
      actionButtons = <Spinner/>;
    }
    else {
      actionButtons = (
        <SubmitActionButtons
          onSubmitButtonPress={this._onSubmitUpdateBioPress}
          onCancelButtonPress={this._onCancelUpdateBioPress} />
      );
    }

    return (
      <View style={styles.updateBioContainer}>

        <Text style={styles.updateBioText}>Update bio</Text>
        <TextInput
          style={styles.updateBioInput}
          onChangeText={(text) => profileOwnerStore.setBio(text)}
          value={profileOwnerStore.getBio()}
          multiline={true}
          maxLength={125}
        />
        {actionButtons}

      </View>
    );
  },

  _onSubmitUpdateBioPress: function() {
    var userId = userLoginMetadataStore.getUserId(),
        bio = profileOwnerStore.getBio();
    Unicycle.exec('uploadUserBio', userId, bio);
  },

  _onCancelUpdateBioPress: function() {
    profileOwnerStore.setBio(this.state.originalBio);
  }

});

module.exports = EditBioBox;
