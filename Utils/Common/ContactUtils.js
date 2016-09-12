'use strict';

var Contacts = require('react-native-contacts');

var IOSPermissions = require('../Enums/IOSPermissions');

var ContactUtils = {
  
  promptForPermission: function(callback) {
    Contacts.requestPermission((err, permission) => {
      callback(permission);
    })
  },

  getAll: function(callback) {
    Contacts.getAll((err, contacts) => {
      if (err && err.type === 'permissionDenied'){
        callback(IOSPermissions.DENIED);
      }
      else {
        // only store contacts that have a phone number
        let contactsWithPhoneNumber = [];
        
        for (let i = 0; i < contacts.length; i++) {
          if (this.getPhoneNumber(contacts[i])) {
            contactsWithPhoneNumber.push(contacts[i]);
          }
        }
        
        callback(contactsWithPhoneNumber.sort(this._sortContactAlphabeticallyByGivenName));
      }
    })
  },
  
  getDisplayName: function(contact) {
    var name = '';

    if (contact.givenName) {
      name += contact.givenName;
    }
    if (contact.middleName) {
      name += ` ${contact.middleName}`;
    }
    if (contact.familyName) {
      name += ` ${contact.familyName}`;
    }

    if (name.length === 0) {
      name = 'Contact has no name';
    }

    return name;
  },

  getPhoneNumber: function(contact) {
    // first try to find a mobile number, then have a chain of other defaults
    for (let i = 0; i < contact.phoneNumbers.length; i++) {
      if (contact.phoneNumbers[i].label === 'mobile') {
        return contact.phoneNumbers[i].number;
      }
    }

    for (let i = 0; i < contact.phoneNumbers.length; i++) {
      if (contact.phoneNumbers[i].label === 'home') {
        return contact.phoneNumbers[i].number;
      }
    }

    for (let i = 0; i < contact.phoneNumbers.length; i++) {
      if (contact.phoneNumbers[i].label === 'work') {
        return contact.phoneNumbers[i].number;
      }
    }

    for (let i = 0; i < contact.phoneNumbers.length; i++) {
      if (contact.phoneNumbers[i].label === 'other') {
        return contact.phoneNumbers[i].number;
      }
    }

    // if all else fails, return any number...
    if (contact.phoneNumbers && contact.phoneNumbers[0] && contact.phoneNumbers[0].number) {
      return contact.phoneNumbers[0].number;
    }

    return null;
  },

  // thank the internet for this, ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
  _sortContactAlphabeticallyByGivenName: function(contactA, contactB) {
    var nameA;
    var nameB;

    // I tried to make this a local function, but for some reason 'this' isn't available...?
    if (contactA.givenName) {
      nameA = contactA.givenName.toUpperCase();
    }
    else if (contactA.middleName) {
      nameA = contactA.middleName.toUpperCase();
    }
    else if (contactA.familyName) {
      nameA = contactA.familyName.toUpperCase();
    }

    if (contactB.givenName) {
      nameB = contactB.givenName.toUpperCase();
    }
    else if (contactB.middleName) {
      nameB = contactB.middleName.toUpperCase();
    }
    else if (contactB.familyName) {
      nameB = contactB.familyName.toUpperCase();
    }

    if (!nameA || !nameB) {
      // didn't find a name to sort by
      return 0;
    }
    else if (nameA < nameB) {
      return -1;
    }
    else if (nameA > nameB) {
      return 1;
    }
    else {
      // names must be equal
      return 0;
    }
  }

};

module.exports = ContactUtils;
