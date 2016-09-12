'use strict';

var React = require('react');
var ReactNative = require('react-native');

var IOSPhoneContact = require('../../Common/IOSPhoneContact');

var Colors = require('../../../Utils/Common/Colors');
var ContactUtils = require('../../../Utils/Common/ContactUtils');
var CommunicationUtils = require('../../../Utils/Common/CommunicationUtils');
var contactsStore = require('../../../stores/ContactsStore');

var {
  View,
  Text,
  AlertIOS,
  ScrollView,
  StyleSheet,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: Colors.MED_GRAY
  },
  scrollContainer: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 12,
    marginLeft: 12,
    marginRight: 12
  },
  totalContactCountLabel: {
    color: Colors.DARK_GRAY,
    fontSize: 18,
    padding: 10,
    textAlign: 'center'
  },
  bulkSelectButton: {
    position: 'absolute',
    top: 12,
    right: 24,
    fontSize: 16
  },
  inviteFriendsButton: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inviteFriendsButtonLabel: {
    color: 'white',
    fontSize: 20
  }
});

var InviteContacts = React.createClass({
  
  propTypes: {
    contactsJson: React.PropTypes.array.isRequired,
    numSelectedPhoneNumbers: React.PropTypes.number.isRequired
  },

  render: function () {
    let contactsJson = this.props.contactsJson,
        contacts = [],
        numIgnoredContacts = 0;

    for (var i = 0; i < contactsJson.length; i++) {
      let contact = contactsJson[i];
      let contactMobileNumber = ContactUtils.getPhoneNumber(contact);
      // for some reason it's possible to create a contact with no phone numbers...
      if (contactMobileNumber) {
        contacts.push(
          <IOSPhoneContact
            key={i}
            contact={contact}
            isSelected={contactsStore.isPhoneNumberSelected(contactMobileNumber)}
            onPress={() => contactsStore.toggleSelectedPhoneNumber(contactMobileNumber)}/>
        );
      }
      else {
        numIgnoredContacts++;
      }
    }

    return (
      <View style={styles.container}>

        <Text style={styles.totalContactCountLabel}>
          {`${contactsStore.getContacts().length - numIgnoredContacts} Contacts`}
        </Text>

        <ScrollView
          style={styles.scrollContainer}
          automaticallyAdjustContentInsets={false}>
          {contacts}
        </ScrollView>

        <TouchableHighlight
          style={[styles.inviteFriendsButton, {backgroundColor: Colors.getPrimaryAppColor()}]}
          underlayColor={Colors.getPrimaryAppColor()}
          onPress={this._onInviteFriendsPress}>
          <Text style={styles.inviteFriendsButtonLabel}>
            {`Invite ${this.props.numSelectedPhoneNumbers} Friends`}
          </Text>
        </TouchableHighlight>

        {this._renderBulkSelectButton()}

      </View>
    );
  },

  _renderBulkSelectButton: function() {
    var allContactsSelected = contactsStore.getSelectedPhoneNumbers().length === contactsStore.getContacts().length;
    
    if (allContactsSelected) {
      return (
        <Text
          style={[styles.bulkSelectButton, {color: Colors.getPrimaryAppColor()}]}
          onPress={() => contactsStore.setSelectedPhoneNumbers([])}>
          Deselect All
        </Text>
      );
    }
    else {
      return (
        <Text
          style={[styles.bulkSelectButton, {color: Colors.getPrimaryAppColor()}]}
          onPress={contactsStore.selectAllContacts}>
          Select All
        </Text>
      );
    }
  },

  _onInviteFriendsPress: function() {
    var numContactsSelected = contactsStore.getSelectedPhoneNumbers().length;

    if (numContactsSelected <= 0) {
      AlertIOS.alert(
        'You must select at least one contact before inviting friends.',
        '',
        {
          text: 'Okay'
        }
      );
    }
    else if (numContactsSelected > this.NUM_SELECTED_CONTACTS_THRESHOLD_TO_SHOW_WARNING) {
      AlertIOS.alert(
        `You've selected ${numContactsSelected} contacts!`,
        'Please be patient, your phone may take a while to load this message.',
        [
          {
            text: 'Send',
            onPress: () => CommunicationUtils.sendText(contactsStore.getSelectedPhoneNumbers(), this.inviteFriendsTextMessageBody)
          },
          {
            text: "Don't send"
          }
        ]
      );
    }
  },

  inviteFriendsTextMessageBody: "I'd like for you to join the Youni fam with me!  It makes college more awesome, if you " +
                                "don't download it, we can't be friends anymore.\n\nClick to download -> http://goo.gl/cfrbji",
  NUM_SELECTED_CONTACTS_THRESHOLD_TO_SHOW_WARNING: 50

});

module.exports = InviteContacts;
