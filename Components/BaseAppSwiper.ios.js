'use strict';

var React = require('react');
var CustomSwiper = require('./CustomSwiper');

var BaseAppSwiper = React.createClass({

  render: function() {
    return (
      <CustomSwiper
        index={1}
        loop={false}
        showsPagination={false}>
        {this.props.children}
      </CustomSwiper>
    );
  }

});

module.exports = BaseAppSwiper;
