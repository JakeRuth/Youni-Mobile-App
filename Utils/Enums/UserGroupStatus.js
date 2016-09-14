'use strict';

// The 'id' values here are synced with values defined in the API.  DO NOT CHANGE!
var UserGroupStatus = {

  NOT_IN_GROUP: {
    id: 'notInGroup',
    label: 'Join Organization',
    secondaryLabel: 'Join'
  },
  IN_GROUP: {
    id: 'inGroup',
    label: ''
  },
  REQUEST_TO_JOIN_PENDING: {
    id: 'requestToJoinPending',
    label: 'Pending'
  },
  REQUEST_TO_JOIN_DECLINED: {
    id: 'requestToJoinDeclined',
    label: 'Join Organization'
  },
  IS_ADMIN: {
    id: 'isAdmin',
    label: 'Manage Group'
  },

  getById: function(id) {
    switch(id) {
      case this.NOT_IN_GROUP.id:
        return this.NOT_IN_GROUP;
      
      case this.IN_GROUP.id:
        return this.IN_GROUP;
      
      case this.REQUEST_TO_JOIN_PENDING.id:
        return this.REQUEST_TO_JOIN_PENDING;
      
      case this.REQUEST_TO_JOIN_DECLINED.id:
        return this.REQUEST_TO_JOIN_DECLINED;
      
      case this.IS_ADMIN.id:
        return this.IS_ADMIN;
      
      default:
        return;
    }
  }
  
};

module.exports = UserGroupStatus;
