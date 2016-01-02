'use strict';

var AjaxUtils = require('../Common/AjaxUtils');

var ProfileUtils = {

  ajax: function(url, data, onSuccessCallback, onFailureCallback) {
    AjaxUtils.ajax(url, data, onSuccessCallback, onFailureCallback);
  }

}

module.exports = ProfileUtils;
