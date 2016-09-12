'use strict';

var Unicycle = require('../Unicycle');

var ContactUtils = require('../Utils/Common/ContactUtils');

var contactsStore = Unicycle.createStore({

  init: function() {
    this.set({
      contacts: [],
      selectedPhoneNumbers: []
    });
  },

  setContacts: function(contacts) {
    this.set({
      contacts: contacts
    });
  },

  setSelectedPhoneNumbers: function(phoneNumbers) {
    this.set({
      selectedPhoneNumbers: phoneNumbers
    });
  },
  
  selectAllContacts: function() {
    var allContacts = this.getContacts(),
        currentSelectedNumbers = this.getSelectedPhoneNumbers();
    
    for (var i = 0; i < allContacts.length; i++) {
      let number = ContactUtils.getPhoneNumber(allContacts[i]);
      // safe here to assume that all contacts have a phone number since we filtered them out when initially loading them. See ContactUtils.getAll
      if (!this.isPhoneNumberSelected(number)) {
        currentSelectedNumbers.push(number);
      }
    }
    
    this.set({
      selectedPhoneNumbers: currentSelectedNumbers
    });
  },

  toggleSelectedPhoneNumber: function(number) {
    if (!number) {
      return;
    }

    if (this.isPhoneNumberSelected(number)) {
      this.removeSelectedPhoneNumber(number);
    }
    else {
      this.addSelectedPhoneNumber(number);
    }
  },
  
  addSelectedPhoneNumber: function(number) {
    var phoneNumbers = this.getSelectedPhoneNumbers();
    
    phoneNumbers.push(number);
    this.set({
      selectedPhoneNumbers: phoneNumbers
    });
  },

  removeSelectedPhoneNumber: function(number) {
    var phoneNumbers = this.getSelectedPhoneNumbers();
    var indexOfSelectedNumber = phoneNumbers.indexOf(number);

    phoneNumbers.splice(indexOfSelectedNumber, 1);
    this.set({
      selectedPhoneNumbers: phoneNumbers
    });
  },

  getContacts: function() {
    return this.get('contacts').toJSON();
  },
  
  getSelectedPhoneNumbers: function() {
    return this.get('selectedPhoneNumbers').toJSON();
  },
  
  isPhoneNumberSelected: function(number) {
    return this.getSelectedPhoneNumbers().indexOf(number) !== -1;
  }

});

module.exports = contactsStore;
