'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Unicycle = require('../../../Unicycle');
var profileStore = require('../../../stores/ProfileStore');
var userLoginMetadataStore = require('../../../stores/UserLoginMetadataStore');

var {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  StyleSheet,
  ActivityIndicatorIOS
} = React

var styles = StyleSheet.create({
  updateBioContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#DBDBDB',
    borderWidth: 1,
    borderRadius: 10,
    margin: 5,
    padding: 10
  },
  updateBioText: {
    flex: 2,
    textAlign: 'center',
    fontSize: 10
  },
  updateBioInput: {
    flex: 5,
    backgroundColor: 'white',
    padding: 15,
    paddingTop: 3,
    height: 75,
    borderWidth: 1,
    borderRadius: 3
  },
  actionButtonsContainer: {
    flexDirection: 'column'
  },
  submitBioButton: {
    flex: 1,
    alignSelf: 'center',
    marginLeft: 5
  },
  cancelBioButton: {
    flex: 1,
    marginTop: 5,
    alignSelf: 'center',
    marginLeft: 5
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

var EditBioBox = React.createClass({

  getInitialState: function() {
    return {
      originalBio: profileStore.getBio()
    };
  },

  render: function() {
    var isUploadBioRequestInFlight = profileStore.isUploadBioRequestInFlight(),
        actionButtons;

    if (isUploadBioRequestInFlight) {
      actionButtons = this.renderSpinner();
    }
    else {
      actionButtons = this.renderActionButtons();
    }

    return (
      <View style={styles.updateBioContainer}>

        <Text style={styles.updateBioText}>Update bio</Text>
        <TextInput
          style={styles.updateBioInput}
          onChangeText={(text) => Unicycle.exec('setBio', text)}
          value={profileStore.getBio()}
          multiline={true}
          maxLength={300} //TODO: think about this value more, is this a just limit?
          clearTextOnFocus={true}
        />
        {actionButtons}

      </View>
    );
  },

  renderActionButtons: function() {
    return (
      <View style={styles.actionButtonsContainer}>
        <TouchableHighlight
          onPress={this._onSubmitUpdateBioPress}
          underlayColor='transparent'>

          <Icon style={styles.submitBioButton}
            name='checkmark' size={30} color={'#007C9E'} />

        </TouchableHighlight>
        <TouchableHighlight
          onPress={this._onCancelUpdateBioPress}
          underlayColor='transparent'>

          <Icon style={styles.cancelBioButton}
            name='close' size={30} color={'#FF7878'} />

        </TouchableHighlight>
      </View>
    );
  },

  renderSpinner: function() {
    return (
      <View style={styles.spinnerContainer}>
        <ActivityIndicatorIOS color='black' size={'small'} />
      </View>
    );
  },

  _onSubmitUpdateBioPress: function() {
    var userId = userLoginMetadataStore.getUserId();
    Unicycle.exec('uploadUserBio', userId, profileStore.getBio());
  },

  _onCancelUpdateBioPress: function() {
    Unicycle.exec('setBio', this.state.originalBio);
  }

});

module.exports = EditBioBox;
