'use strict';

var React = require('react-native');
var Unicycle = require('../../../Unicycle');

var ChangeProfilePicture = require('./ChangeProfilePicture');
var EditProfileFieldInput = require('../../Common/EditProfileFieldInput');

var Colors = require('../../../Utils/Common/Colors');
var profileOwnerStore = require('../../../stores/profile/ProfileOwnerStore');
var editProfileInformationStore = require('../../../stores/profile/EditProfileInformationStore');

var {
  View,
  Text,
  TextInput,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  changeProfilePictureContainer: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LIGHT_GRAY
  },
  editBioContainer: {
    flex: 1,
    height: 80,
    padding: 10
  },
  editBioInput: {
    flex: 1,
    fontSize: 16
  }
});

var EditSettingsPage = React.createClass({

  propTypes: {
    user: React.PropTypes.object.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  mixins: [
    Unicycle.listenTo(editProfileInformationStore)
  ],

  componentWillMount: function() {
    editProfileInformationStore.setFirstName(profileOwnerStore.getFirstName());
    editProfileInformationStore.setLastName(profileOwnerStore.getLastName());
    editProfileInformationStore.setBio(profileOwnerStore.getBio());
  },

  render: function() {
    return (
      <View>

        <View style={styles.changeProfilePictureContainer}>
          <ChangeProfilePicture/>
        </View>

        <EditProfileFieldInput
          label="First Name"
          value={editProfileInformationStore.getFirstName()}
          placeholder={profileOwnerStore.getFirstName()}
          onChangeText={(text) => editProfileInformationStore.setFirstName(text)}
          maxLength={25}/>
        <EditProfileFieldInput
          label="Last Name"
          value={editProfileInformationStore.getLastName()}
          placeholder={profileOwnerStore.getLastName()}
          onChangeText={(text) => editProfileInformationStore.setLastName(text)}
          maxLength={25}/>
        {this._renderEditBioInput()}

      </View>
    );
  },

  _renderEditBioInput: function() {
    var bioText;

    if (!editProfileInformationStore.getBio()) {
      bioText = 'Edit Bio';
    }

    return (
      <View style={styles.editBioContainer}>
        <TextInput
          style={styles.editBioInput}
          onChangeText={(text) => editProfileInformationStore.setBio(text)}
          value={editProfileInformationStore.getBio()}
          placeholder={bioText}
          placeholderTextColor={Colors.DARK_GRAY}
          multiline={true}
          maxLength={125}
          keyboardType="twitter"/>
      </View>
    );
  }

});

module.exports = EditSettingsPage;
