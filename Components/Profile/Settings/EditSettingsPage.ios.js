'use strict';

var React = require('react-native');
var Unicycle = require('../../../Unicycle');
var ChangeProfilePicture = require('./ChangeProfilePicture');
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
  editNameContainer: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    height: 44,
    padding: 10
  },
  editNameLabel: {
    fontWeight: '100',
    color: Colors.DARK_GRAY,
    fontSize: 16
  },
  editNameInput: {
    flex: 1,
    textAlign: 'right',
    fontSize: 16
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

  componentDidMount: function() {
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
        {this._renderEditFirstNameInput()}
        {this._renderEditLastNameInput()}
        {this._renderEditBioInput()}

      </View>
    );
  },
  
  _renderEditFirstNameInput: function() {
    return (
      <View style={styles.editNameContainer}>
        <Text style={styles.editNameLabel}>
          First Name
        </Text>
        <TextInput
          style={styles.editNameInput}
          onChangeText={(text) => editProfileInformationStore.setFirstName(text)}
          placeholder={profileOwnerStore.getFirstName()}
          placeholderTextColor={Colors.DARK_GRAY}
          maxLength={25}/>
      </View>
    );
  },

  _renderEditLastNameInput: function() {
    return (
      <View style={styles.editNameContainer}>
        <Text style={styles.editNameLabel}>
          Last Name
        </Text>
        <TextInput
          style={styles.editNameInput}
          onChangeText={(text) => editProfileInformationStore.setLastName(text)}
          placeholder={profileOwnerStore.getLastName()}
          placeholderTextColor={Colors.DARK_GRAY}
          maxLength={25}/>
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
