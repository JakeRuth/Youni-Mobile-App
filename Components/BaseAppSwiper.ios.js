'use strict';

var React = require('react');
var Swiper = require('./Swiper');

var AppPage = require('../Utils/Enums/AppPage');

var BaseAppSwiper = React.createClass({

  render: function() {
    return (
      <Swiper
        index={AppPage.HOME.index}
        loop={false}
        showsPagination={false}>
        {this.props.children}
      </Swiper>
    );
  }

});

module.exports = BaseAppSwiper;
