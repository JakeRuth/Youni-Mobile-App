'use strict';

var React = require('react-native');
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
  StyleSheet,
  AlertIOS
} = React

var styles = StyleSheet.create({
  updateFirstNameContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#DBDBDB',
    borderWidth: 1,
    borderRadius: 10,
    margin: 5,
    padding: 10,
    alignItems: 'center'
  },
  updateFirstNameText: {
    flex: 2,
    textAlign: 'center',
    fontSize: 10
  },
  updateFirstNameInputContainer: {
    flex: 5
  },
  updateFirstNameInput: {
    backgroundColor: 'white',
    padding: 2,
    height: 25,
    borderWidth: 1,
    borderRadius: 3
  },
  //These sizes were carefully picked so the box doesn't 'resize' its contents
  //when rendering the spinner instead of the action buttons
  spinnerContainer: {
    height: 71,
    width: 29
  }
});

var EditFirstNameBox = React.createClass({

  getInitialState: function() {
    return {
      originalFirstName: profileOwnerStore.getFirstName()
    };
  },

  render: function() {
    var isUploadFirstNameRequestInFlight = editProfileInformationStore.isUploadFirstNameRequestInFlight(),
        actionButtons;

    if (isUploadFirstNameRequestInFlight) {
      actionButtons = (
        <View style={styles.spinnerContainer}>
          <Spinner/>
        </View>
      );
    }
    else {
      actionButtons = (
        <SubmitActionButtons
          onSubmitButtonPress={this._onSubmitUpdateFirstNamePress}
          onCancelButtonPress={this._onCancelUpdateFirstNamePress} />
      );
    }

    return (
      <View style={styles.updateFirstNameContainer}>

        <Text style={styles.updateFirstNameText}>Update First Name</Text>
        <View style={styles.updateFirstNameInputContainer}>
          <TextInput
            style={styles.updateFirstNameInput}
            onChangeText={(text) => Unicycle.exec('setFirstName', text)}
            value={profileOwnerStore.getFirstName()}
            maxLength={25} //Hopefully someone doesnt have a 25+ cahracter first name?
          />
        </View>
        {actionButtons}

      </View>
    );
  },

  _onSubmitUpdateFirstNamePress: function() {
    var userId = userLoginMetadataStore.getUserId(),
        firstName = profileOwnerStore.getFirstName();

    if (firstName.trim()) {
      userLoginMetadataStore.setFirstName(firstName);
      Unicycle.exec('updateUserFirstName', userId, firstName);
    }
    else {
      AlertIOS.alert(
        'Sorry, your first name cannot be blank.',
        'Tried to pull a fast one on us, aye?',
        [
          {text: 'Okay'}
        ]
      )
    }
  },

  _onCancelUpdateFirstNamePress: function() {
    Unicycle.exec('setFirstName', this.state.originalFirstName);
  }

});

module.exports = EditFirstNameBox;
