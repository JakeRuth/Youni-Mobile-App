'use strict';

var React = require('react');
var ReactNative = require('react-native');
var LowMemListView = require('react-native-sglistview');

var IOSPhoneContact = require('../../Common/IOSPhoneContact');
var SearchBarInput = require('../../Search/SearchBarInput');

var Colors = require('../../../Utils/Common/Colors');
var ContactUtils = require('../../../Utils/Common/ContactUtils');
var CommunicationUtils = require('../../../Utils/Common/CommunicationUtils');
var contactsStore = require('../../../stores/ContactsStore');

var {
  View,
  Text,
  AlertIOS,
  ListView,
  StyleSheet,
  TouchableHighlight,
  RecyclerViewBackedScrollView
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: Colors.MED_GRAY
  },
  searchBarContainer: {
    margin: 10
  },
  scrollContainer: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 12,
    marginLeft: 12,
    marginRight: 12
  },
  totalContactCountLabel: {
    position: 'relative',
    color: Colors.DARK_GRAY,
    fontSize: 18,
    padding: 10,
    textAlign: 'center'
  },
  bulkSelectButton: {
    position: 'absolute',
    top: 64,
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
    return (
      <View style={styles.container}>

        <SearchBarInput
          style={styles.searchBarContainer}
          value={contactsStore.getSearchTerm()}
          alwaysShowClearButton={contactsStore.getSearchTerm().length > 0}
          placeholder={'     Search Contacts'}
          onChangeText={(search) => contactsStore.setSearchTerm(search)}
          onClearSearchPress={() => contactsStore.setSearchTerm('')}/>

        <Text style={styles.totalContactCountLabel}>
          {`${contactsStore.getContacts().length} Contacts`}
        </Text>

        <LowMemListView
          style={styles.scrollContainer}
          initialListSize={this.props.contactsJson.length}
          dataSource={this._getDataSource()}
          renderRow={this._renderRow}
          renderScrollComponent={(props) => <RecyclerViewBackedScrollView {...props}/>}/>

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

  _renderRow: function(contact) {
    let contactMobileNumber = ContactUtils.getPhoneNumber(contact);
    return (
      <IOSPhoneContact
        contact={contact}
        isSelected={contactsStore.isPhoneNumberSelected(contactMobileNumber)}
        onPress={() => contactsStore.toggleSelectedPhoneNumber(contactMobileNumber)}/>
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

  _getDataSource: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return ds.cloneWithRows(this.props.contactsJson);
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
    else {
      CommunicationUtils.sendText(contactsStore.getSelectedPhoneNumbers(), this.inviteFriendsTextMessageBody);
    }
  },

  inviteFriendsTextMessageBody: "I'd like for you to join the Youni fam with me!  It makes college more awesome, if you " +
                                "don't download it, we can't be friends anymore.\n\nClick to download -> http://goo.gl/cfrbji",
  NUM_SELECTED_CONTACTS_THRESHOLD_TO_SHOW_WARNING: 50

});

module.exports = InviteContacts;
