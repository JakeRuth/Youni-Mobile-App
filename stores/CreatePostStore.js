'use strict';

var React = require('react-native');
var Unicycle = require('../Unicycle');
var AjaxUtils = require('../Utils/Common/AjaxUtils');

var createPostStore = Unicycle.createStore({

  init: function () {
    this.set({
      isRequestInFlight: false,
      imageId: '',
      caption: '',
      groupIds: []
    });
  },

  $createPost: function (userId, onSuccessCallback) {
    var that = this,
        caption = this.getCaption(),
        groupIds = this.getGroupIds(),
        imageId = this.getImageId();

    this.set({
      isRequestInFlight: true
    });

    AjaxUtils.ajax(
      '/post/create',
      {
        posterUserIdString: userId,
        pictureIdString: imageId,
        groupIdStrings: groupIds.toJSON(),
        caption: caption ? caption : '_' //TODO: Fix this in the api!!!!
      },
      (res) => {
        that.set({
          isRequestInFlight: false
        });

        onSuccessCallback();
      },
      () => {
        that.set({
          isRequestInFlight: false
        });
      }
    );
  },

  setImageId: function (id) {
    this.set({
      imageId: id
    });
  },

  setCaption: function (caption) {
    this.set({
      caption: caption
    });
  },
  
  setGroupIds: function(ids) {
    this.set({
      groupIds: ids
    });
  },

  toggleGroupIdInList: function (id) {
    var groupIds = this.getGroupIds(),
        indexOfId = groupIds.indexOf(id),
        isIdInGroup = indexOfId !== -1;

    if (!isIdInGroup) {
      this.set({
        groupIds: groupIds.push(id)
      });
    }
    else {
      this.set({
        groupIds: groupIds.splice(indexOfId, 1)
      });
    }
  },

  isRequestInFlight: function () {
    return this.get('isRequestInFlight');
  },

  isGroupIdSelected: function(id) {
    return this.getGroupIds().indexOf(id) !== -1;
  },

  getImageId: function () {
    return this.get('imageId');
  },

  getCaption: function () {
    return this.get('caption');
  },
  
  getGroupIds: function() {
    return this.get('groupIds');
  }

});

module.exports = createPostStore;
