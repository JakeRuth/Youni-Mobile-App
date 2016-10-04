'use strict';

var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var Colors = {

  DEFAULT_APP_PRIMARY: '#7700FF',
  
  getPrimaryAppColor: function() {
    return userLoginMetadataStore.getNetworkColor() ? userLoginMetadataStore.getNetworkColor() : this.DEFAULT_APP_PRIMARY;
  },

  LIGHT_PURPLE: '#E3E8FD',
  DARK_GRAY: '#1E2022',
  MED_GRAY: '#9B9B9B',
  LIGHT_GRAY: '#EAEAEA',
  BORDER_POP: '#D6D6D6',
  WHITE_SMOKE: '#FAFAFA',
  LOUD_RED: '#FF5368',
  DARK_TEXT_SHADOW: '#656565'

};

module.exports = Colors;
