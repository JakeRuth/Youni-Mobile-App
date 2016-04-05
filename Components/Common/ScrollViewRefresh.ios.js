'use strict';

var React = require('react-native');
GLOBAL = require('../../Utils/Common/GlobalColorMap');

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
        tintColor={GLOBAL.COLOR.APP}
        colors={[GLOBAL.COLOR.APP]}/>
    );
  }

});

module.exports = ScrollViewRefresh;
