'use strict';

var Unicycle = require('../../Unicycle');

var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var userLoginMetadataStore = require('../UserLoginMetadataStore');

var campusChallengeStore = Unicycle.createStore({

  init: function () {
    this.set({
      isLoadingCurrentChallenge: true,
      currentChallenge: null,
      noCurrentChallenge: false
    });
  },

  requestCurrentChallenge: function() {
    var that = this;

    this.set({
      isLoadingCurrentChallenge: true
    });

    AjaxUtils.ajax(
      '/campusChallenge/getCurrentForNetwork',
      {
        networkName: userLoginMetadataStore.getNetworkName()
      },
      (res) => {
        that.set({
          currentChallenge: res.body.challenge,
          noCurrentChallenge: res.body.isChallengeEmpty,
          isLoadingCurrentChallenge: false
        });
      },
      () => {
        that.set({
          isLoadingCurrentChallenge: false
        });
      }
    );
  },

  isLoadingCurrentChallenge: function() {
    return this.get('isLoadingCurrentChallenge');
  },

  getCurrentChallenge: function() {
    let currChallenge = this.get('currentChallenge');
    return currChallenge ? currChallenge.toJSON() : null;
  },

  getNoCurrentChallenge: function() {
    return this.get('noCurrentChallenge');
  }

});

module.exports = campusChallengeStore;
