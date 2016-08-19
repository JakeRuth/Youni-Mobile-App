'use strict';

var React = require('react');
var ReactNative = require('react-native');
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
  Keyboard,
  ScrollView,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    padding: 10
  },
  changeProfilePictureContainer: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LIGHT_GRAY
  },
  editBioContainer: {
    flex: 1,
    height: 80
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

  getInitialState: function () {
    return {
      isKeyboardVisible: false
    };
  },

  componentWillMount: function() {
    editProfileInformationStore.setFirstName(profileOwnerStore.getFirstName());
    editProfileInformationStore.setLastName(profileOwnerStore.getLastName());
    editProfileInformationStore.setBio(profileOwnerStore.getBio());
  },

  componentDidMount() {
    Keyboard.addListener('keyboardWillShow', () => {
      this.setState({isKeyboardVisible: true});
    });
    Keyboard.addListener('keyboardWillHide', () => {
      this.setState({isKeyboardVisible: false});
    });
  },

  render: function() {
    var hackyKeyboardPadding;

    if (this.state.isKeyboardVisible) {
      hackyKeyboardPadding = <View style={{height: 250}}/>;
    }

    return (
      <ScrollView
        style={styles.container}
        automaticallyAdjustContentInsets={false}>

        <View style={styles.changeProfilePictureContainer}>
          <ChangeProfilePicture {...this.props}/>
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

        {hackyKeyboardPadding}

      </ScrollView>
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
