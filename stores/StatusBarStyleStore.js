'use strict';

var Unicycle = require('../Unicycle');
var IosStatusBarStyles = require('../Utils/Common/IosStatusBarStyles');

var statusBarStyleStore = Unicycle.createStore({

  init: function () {
    this.set({
      style: IosStatusBarStyles.LIGHT_CONTENT
    });
  },
  
  setStyle: function(style) {
    this.set({
      style: style
    });
  },
  
  setDelayedStyle: function(style, delay) {
    setTimeout(function() {
      this.setStyle(style);
    }.bind(this), delay);
  },
  
  getStyle: function() {
    return this.get('style');
  }

});

module.exports = statusBarStyleStore;
