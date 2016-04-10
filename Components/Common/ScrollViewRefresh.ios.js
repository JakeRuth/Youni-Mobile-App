'use strict';

var React = require('react-native');
var Color = require('../../Utils/Common/GlobalColorMap');

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
        tintColor={Color.YOUNI_PRIMARY_PURPLE}
        colors={[Color.YOUNI_PRIMARY_PURPLE]}/>
    );
  }

});

module.exports = ScrollViewRefresh;
