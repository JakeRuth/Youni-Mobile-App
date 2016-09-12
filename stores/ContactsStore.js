'use strict';

var Unicycle = require('../Unicycle');

var ContactUtils = require('../Utils/Common/ContactUtils');

var contactsStore = Unicycle.createStore({

  init: function() {
    this.set({
      allContacts: [],
      contacts: [], // can be filtered if a search term is present
      selectedPhoneNumbers: [],
      searchTerm: ''
    });
  },

  setAllContacts: function(contacts) {
    this.set({
      allContacts: contacts
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
  
  setSearchTerm: function(searchTerm) {
    var filteredContacts = [];
    if (searchTerm.length > 0) {
      filteredContacts = this._filterContactsForSearchTerm(searchTerm);
    }
    else {
      filteredContacts = this.getAllContacts();
    }

    this.set({
      searchTerm: searchTerm,
      contacts: filteredContacts
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

  getAllContacts: function() {
    return this.get('allContacts').toJSON();
  },

  getContacts: function() {
    return this.get('contacts').toJSON();
  },
  
  getSelectedPhoneNumbers: function() {
    return this.get('selectedPhoneNumbers').toJSON();
  },
  
  getSearchTerm: function() {
    return this.get('searchTerm');
  },
  
  isPhoneNumberSelected: function(number) {
    return this.getSelectedPhoneNumbers().indexOf(number) !== -1;
  },

  _filterContactsForSearchTerm: function(searchTerm) {
    var filteredContacts = [],
        allContacts = this.getAllContacts();

    for (var i = 0; i < allContacts.length; i++) {
      let name = ContactUtils.getDisplayName(allContacts[i]),
          isMatch = name.match(new RegExp(searchTerm, 'i'));
      
      if (isMatch) {
        filteredContacts.push(allContacts[i]);
      }
    }
    
    return filteredContacts;
  }

});

module.exports = contactsStore;
