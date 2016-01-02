'use strict';

var AjaxUtils = require('../Common/AjaxUtils');

var ProfileUtils = {

  getProfileAjax: function(data, onSuccessCallback, onFailureCallback) {
    AjaxUtils.ajax('/user/getProfileInformation', data, onSuccessCallback, onFailureCallback);
  },

  getUserPostsAjax: function(data, onSuccessCallback, onFailureCallback) {
    AjaxUtils.ajax('/user/getPosts', data, onSuccessCallback, onFailureCallback);
  }

}

module.exports = ProfileUtils;
