'use strict';

var React = require('react-native');

var {
  RefreshControl
} = React;

var ScrollViewRefresh = React.createClass({

  propTypes: {
    onRefresh: React.PropTypes.func.isRequired,
    isRefreshing: React.PropTypes.bool.isRequired
  },

  render: function() {
    return (
      <RefreshControl
        refreshing={this.props.isRefreshing}
        onRefresh={this.props.onRefresh}
        tintColor="#5C7CFF"
        colors={['#5C7CFF']}/>
    );
  }

});

module.exports = ScrollViewRefresh;
