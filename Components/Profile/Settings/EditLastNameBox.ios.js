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
  updateLastNameContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#DBDBDB',
    borderWidth: 1,
    borderRadius: 10,
    margin: 5,
    padding: 10,
    alignItems: 'center'
  },
  updateLastNameText: {
    flex: 2,
    textAlign: 'center',
    fontSize: 10
  },
  updateLastNameInputContainer: {
    flex: 5
  },
  updateLastNameInput: {
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

var EditLastNameBox = React.createClass({

  getInitialState: function() {
    return {
      originalLastName: profileOwnerStore.getLastName()
    };
  },

  render: function() {
    var isUploadLastNameRequestInFlight = editProfileInformationStore.isUploadLastNameRequestInFlight(),
        actionButtons;

    if (isUploadLastNameRequestInFlight) {
      actionButtons = <View style={styles.spinnerContainer}>
        <Spinner
          color={'black'}/>
      </View>
    }
    else {
      actionButtons = (
        <SubmitActionButtons
          onSubmitButtonPress={this._onSubmitUpdateLastNamePress}
          onCancelButtonPress={this._onCancelUpdateLastNamePress} />
      );
    }

    return (
      <View style={styles.updateLastNameContainer}>

        <Text style={styles.updateLastNameText}>Update Last Name</Text>
        <View style={styles.updateLastNameInputContainer}>
          <TextInput
            style={styles.updateLastNameInput}
            onChangeText={(text) => Unicycle.exec('setLastName', text)}
            value={profileOwnerStore.getLastName()}
            maxLength={25} //Hopefully someone doesnt have a 25+ cahracter first name?
          />
        </View>
        {actionButtons}

      </View>
    );
  },

  _onSubmitUpdateLastNamePress: function() {
    var userId = userLoginMetadataStore.getUserId(),
        lastName = profileOwnerStore.getLastName();

    if (lastName.trim()) {
      userLoginMetadataStore.setLastName(lastName);
      Unicycle.exec('updateUserLastName', userId, lastName);
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

  _onCancelUpdateLastNamePress: function() {
    Unicycle.exec('setLastName', this.state.originalFirstName);
  }

});

module.exports = EditLastNameBox;
