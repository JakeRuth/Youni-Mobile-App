'use strict';

var GroupUtils = {

  isUserAdmin: function(group, userEmail) {
    return group.adminEmails.indexOf(userEmail) !== -1;
  }

};

module.exports = GroupUtils;