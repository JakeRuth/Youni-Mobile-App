'use strict';

var React = require('react');
var ReactNative = require('react-native');

var Spinner = require('../Common/Spinner');

var {
  StyleSheet,
  ScrollView
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    paddingLeft: 15,
    paddingRight: 15
  },
  spinner: {
    marginTop: 15
  }
});

var TrendingList = React.createClass({

  propTypes: {
    onPageRefresh: React.PropTypes.func.isRequired,
    isPageLoading: React.PropTypes.bool.isRequired
  },

  render: function() {
    var content,
        trendingUsersJson = this.props.users;

    if (this.props.isPageLoading) {
      content = <Spinner style={styles.spinner}/>;
    }
    else {
      content = this.props.children;
    }

    return (
      <ScrollView
        style={styles.container}
        automaticallyAdjustContentInsets={false}
        onScroll={this._handleScroll}>
        {content}
      </ScrollView>
    );
  },

  _handleScroll: function(e) {
    var infiniteScrollThreshold = -1;

    if (e.nativeEvent.contentOffset.y < infiniteScrollThreshold) {
      this.props.onPageRefresh();
    }
  }

});

module.exports = TrendingList;
