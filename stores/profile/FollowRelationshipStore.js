'use strict';

var Unicycle = require('../../Unicycle');
var userLoginMetadataStore = require('../UserLoginMetadataStore');

var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var UserUtils = require('../../Utils/User/UserUtils');
var UserFollowRelationshipFilter = require('../../Utils/Enums/UserFollowRelationshipFilter');

var followRelationshipStore = Unicycle.createStore({

  init: function () {
    this.set({
      initialPageLoading: false,
      isLoading: false,
      moreToFetch: false,
      users: [],
      offset: 0,
      selectedFilter: UserFollowRelationshipFilter.FOLLOWING,
      PAGE_SIZE: 50
    });
  },

  fetchFollowRelationships: function() {
    var offset = this.getOffset(),
        pageSize = this.get('PAGE_SIZE'),
        that = this,
        currentUsers;

    if (this.getOffset() === 0) {
      this.set({
        initialPageLoading: true,
        users: []
      });
    }
    else {
      this.set({
        isLoading: true
      });
    }

    currentUsers = this.getUsers();
    AjaxUtils.ajax(
      this._getFetchFollowUrl(),
      {
        userEmail: userLoginMetadataStore.getEmail(),
        fetchOffsetAmount: this.getOffset(),
        maxToFetch: pageSize
      },
      (res) => {
        var users = UserUtils.convertResponseUserListToMap(res.body.followingUsers);

        that.set({
          users: currentUsers.concat(users),
          moreToFetch: res.body.moreResults,
          offset: offset + pageSize,
          initialPageLoading: false,
          isLoading: false
        });
      },
      () => {
        that.set({
          initialPageLoading: false,
          isLoading: false
        });
      }
    );
  },
  
  resetState: function() {
    this.set({
      initialPageLoading: false,
      isLoading: false,
      moreToFetch: false,
      users: [],
      offset: 0,
      selectedFilter: UserFollowRelationshipFilter.FOLLOWING
    });
  },

  setSelectedFilter: function(value) {
    var oldFilter = this.getSelectedFilter();

    this.set({
      selectedFilter: value
    });

    if (oldFilter !== this.getSelectedFilter()) {
      this.set({
        offset: 0
      });
      this.fetchFollowRelationships();
    }
  },

  isInitialPageLoading: function() {
    return this.get('initialPageLoading');
  },

  isLoading: function() {
    return this.get('isLoading');
  },

  getUsers: function() {
    return this.get('users').toJSON();
  },

  getMoreToFetch: function() {
    return this.get('moreToFetch');
  },

  getOffset: function() {
    return this.get('offset');
  },

  getSelectedFilter: function() {
    return this.get('selectedFilter');
  },

  _getFetchFollowUrl: function() {
    if (this.getSelectedFilter() === UserFollowRelationshipFilter.FOLLOWING) {
      return '/user/fetchFollowing';
    }
    else {
      return '/user/fetchFans';
    }
  }

});

module.exports = followRelationshipStore;
