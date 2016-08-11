'use strict';

var ReactNative = require('react-native');

var {
  AsyncStorage
} = ReactNative;

var AsyncStorageUtils = {

  EMAIL_STORAGE_KEY: 'email',
  PASSWORD_STORAGE_KEY: 'password',

  getEmailAndPassword: function(callback) {
    AsyncStorage.multiGet(['email', 'password']).then((response) => {
      callback(response);
    }).done();
  },

  saveItem: function(key, value) {
    AsyncStorage.setItem(key, value);
  },

  removeItem: function(key) {
    AsyncStorage.removeItem(key);
  }

};

module.exports = AsyncStorageUtils;
