'use strict';

var React = require('react');
var Unicycle = require('../Unicycle');

var YouniNavigator = require('./Common/YouniNavigator');

var LoggedInUserBasePage = React.createClass({

  render: function() {
    return (
      <YouniNavigator
        initialRoute={{
          component: require('./LandingPage')
        }}
        renderScene={(route, navigator) => React.createElement(route.component, { navigator, ...route.passProps }) }/>
    );
  }

});

module.exports = LoggedInUserBasePage;
