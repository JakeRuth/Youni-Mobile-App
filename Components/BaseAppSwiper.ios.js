'use strict';

var React = require('react');
var CustomSwiper = require('./CustomSwiper');

var AppPage = require('../Utils/Enums/AppPage');

var BaseAppSwiper = React.createClass({

  render: function() {
    return (
      <CustomSwiper
        index={AppPage.HOME.index}
        loop={false}
        showsPagination={false}>
        {this.props.children}
      </CustomSwiper>
    );
  }

});

module.exports = BaseAppSwiper;
