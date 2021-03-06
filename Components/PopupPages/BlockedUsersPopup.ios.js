'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Unicycle = require('../../Unicycle');

var YouniHeader = require('../Common/YouniHeader');
var Spinner = require('../Common/Spinner');
var BackArrow = require('../Common/BackArrow');
var BlockedUsersPage = require('../Profile/Settings/BlockedUsersPage');

var editProfileInformationStore = require('../../stores/profile/EditProfileInformationStore');
var userLoginMetaDataStore = require('../../stores/UserLoginMetadataStore');
var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Text,
  ScrollView,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  pageHeader: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center'
  },
  spinnerContainer: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center'
  }
});

var BlockedUsersPopup = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

  mixins: [
    Unicycle.listenTo(editProfileInformationStore)
  ],

  componentDidMount() {
    var userEmail = userLoginMetaDataStore.getEmail();
    editProfileInformationStore.requestBlockedUsers(userEmail);
  },

  render: function () {
    var content;

    if (this.isPageRequestInFlight()) {
      content = (
        <View style={styles.spinnerContainer}>
          <Spinner/>
        </View>
      );
    }
    else {
      content = (
        <BlockedUsersPage users={editProfileInformationStore.getBlockedUsers()}/>
      );
    }

    return (
      <View style={styles.container}>

        <YouniHeader>
          <Text style={[styles.pageHeader, { color: Colors.getPrimaryAppColor() }]}>
            Blocked Users
          </Text>
          <BackArrow onPress={() => {this.props.navigator.pop();}}/>
        </YouniHeader>

        {content}

      </View>
    );
  },

  isPageRequestInFlight: function() {
    return (
      editProfileInformationStore.isGetBlockedUsersRequestInFlight() ||
      editProfileInformationStore.isRemoveBlockRequestInFlight()
    );
  }

});

module.exports = BlockedUsersPopup;
