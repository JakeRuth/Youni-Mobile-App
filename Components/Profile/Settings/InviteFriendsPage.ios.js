'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Unicycle = require('../../../Unicycle');

var InviteContacts = require('./InviteContacts');
var YouniHeader = require('../../Common/YouniHeader');
var BackArrow = require('../../Common/BackArrow');
var Spinner = require('../../Common/Spinner');
var PrettyTouchable = require('../../Common/PrettyTouchable');
var Emoji = require('../../Common/Emoji');

var contactsStore = require('../../../stores/ContactsStore');
var Colors = require('../../../Utils/Common/Colors');
var ContactUtils = require('../../../Utils/Common/ContactUtils');
var IOSPermissions = require('../../../Utils/Enums/IOSPermissions');

var {
  View,
  Text,
  AlertIOS,
  StyleSheet,
  Dimensions
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
    alignItems: 'center',
    justifyContent: 'center'
  },
  noContactPermissionMessageContainer: {
    marginTop: -20,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  noContactPermissionMessageMessage: {
    color: Colors.DARK_GRAY,
    textAlign: 'center',
    fontSize: 18,
    paddingLeft: 20,
    paddingRight: 20
  },
  noContactPermissionSubTitle: {
    color: Colors.MED_GRAY,
    textAlign: 'center',
    fontSize: 16,
    padding: 20,
    paddingTop: 5
  }
});

var InviteFriendsPage = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },
  
  getInitialState: function() {
    return {
      isLoading: true,
      contactsPermissionAuthorized: false
    };
  },
  
  componentDidMount: function() {
    this._getAllContacts();
  },

  mixins: [
    Unicycle.listenTo(contactsStore)
  ],

  render: function () {
    var content;

    if (this.state.isLoading) {
      content = (
        <View style={styles.spinnerContainer}>
          <Spinner/>
        </View>
      );
    }
    else if (!this.state.contactsPermissionAuthorized) {
      content = this._renderContactsPermissionDeniedMessage();
    }
    else {
      content = (
        <InviteContacts
          contactsJson={contactsStore.getContacts()}
          numSelectedPhoneNumbers={contactsStore.getSelectedPhoneNumbers().length}/>
      );
    }

    return (
      <View style={styles.container}>

        <YouniHeader>
          <Text style={[styles.pageHeader, { color: Colors.getPrimaryAppColor() }]}>
            Invite Friends
          </Text>
          <BackArrow onPress={() => this.props.navigator.pop()}/>
        </YouniHeader>

        {content}

      </View>
    );
  },
  
  _renderContactsPermissionDeniedMessage: function() {
    return (
      <View style={styles.noContactPermissionMessageContainer}>
        <Text style={styles.noContactPermissionMessageMessage}>
          You didn't give us permission to access your contacts <Emoji name="thumbsdown" size={18}/>
        </Text>
        <Text style={styles.noContactPermissionSubTitle}>
          Please go to the Settings app, click on Youni, and toggle the Contacts permission to on
          if you'd like to invite your friends
        </Text>
        <PrettyTouchable
          label="Reload"
          containerStyle={{
            height: 44,
            width: Dimensions.get('window').width * .8
          }}
          onPress={() => ContactUtils.promptForPermission(this.onRequestPermissionCallback)}/>
      </View>
    );
  },

  onRequestPermissionCallback(permission) {
    if (permission === IOSPermissions.AUTHORIZED) {
      this.setState({
        contactsPermissionAuthorized: true
      });
      this._getAllContacts();
    }
  },

  _getAllContacts: function() {
    if (contactsStore.getContacts().length !== 0) {
      this.setState({
        isLoading: false,
        contactsPermissionAuthorized: true
      });
      return;
    }

    ContactUtils.getAll((res) => {
      if (res !== IOSPermissions.DENIED) {
        this.setState({
          contactsPermissionAuthorized: true
        });
        contactsStore.setContacts(res);
        contactsStore.setAllContacts(res);

        if (res.length >= 1000) {
          AlertIOS.alert(
            'Wow, you have a ton of contacts!',
            'We apologize for this, but since you are so popular this page may be a bit laggy.',
            [
              {
                text: 'Okay'
              }
            ]
          );
        }
      }

      this.setState({
        isLoading: false
      });
    });
  }

});

module.exports = InviteFriendsPage;
