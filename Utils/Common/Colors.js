'use strict';

var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var Colors = {

  YOUNI_PRIMARY: userLoginMetadataStore.getNetworkColor() ? userLoginMetadataStore.getNetworkColor() : '#7700FF',

  LIGHT_YOUNI_PURPLE: '#E3E8FD',
  DARK_GRAY: '#1E2022',
  MED_GRAY: '#9B9B9B',
  LIGHT_GRAY: '#EAEAEA',
  BORDER_POP: '#D6D6D6',
  WHITE_SMOKE: '#FAFAFA'

};

module.exports = Colors;
