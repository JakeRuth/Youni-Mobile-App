'use strict';

var React = require('react');

var CustomSwiper = require('./CustomSwiper');

var mainAppSwipePageStore = require('../stores/common/MainAppSwipePageStore');

var BaseAppSwiper = React.createClass({

  render: function() {
    return (
      <CustomSwiper
        index={mainAppSwipePageStore.getCurrentPageIndex()}
        loop={false}
        showsPagination={false}>
        {this.props.children}
      </CustomSwiper>
    );
  }

});

module.exports = BaseAppSwiper;
