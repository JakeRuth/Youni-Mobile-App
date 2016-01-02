'use strict';

var AjaxUtils = require('../Common/AjaxUtils');

var SignupUtils = {

  ajax: function(url, data, onSuccessCallback, onFailureCallback) {
    AjaxUtils.ajax(url, data, onSuccessCallback, onFailureCallback);
  }

}

module.exports = SignupUtils;
