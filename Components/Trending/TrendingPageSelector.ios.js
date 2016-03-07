'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  feedSelector: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 15,
    marginRight: 15
  },
  selectedFeedSelector: {
    borderBottomWidth: 1,
    borderBottomColor: '#5d6aff'
  },
  selector: {
    fontSize: 20,
    color: '#ADADAD',
    padding: 5
  },
  selectedSelector: {
    color: '#4C4C4C'
  }
});

var TrendingPageSelector = React.createClass({

  weeklyFeed: 'Weekly',
  allTimeFeed: 'All Time',

  propTypes: {
    disabled: React.PropTypes.bool
  },

  getInitialState: function() {
    return {
      selectedFeed: this.weeklyFeed
    };
  },

  render: function() {
    return (
      <View style={styles.container}>
        {this._renderFeedSelector(this.weeklyFeed)}
        {this._renderFeedSelector(this.allTimeFeed)}
      </View>
    );
  },

  _renderFeedSelector: function(feed) {
    var textSelectedStyle = {},
        containerSelectedStyle = {};

    if (feed == this.state.selectedFeed) {
      textSelectedStyle = styles.selectedSelector;
      containerSelectedStyle = styles.selectedFeedSelector;
    }

    return (
      <TouchableHighlight
        style={[styles.feedSelector, containerSelectedStyle]}
        underlayColor={'transparent'}
        onPress={() => {this._changeFeedSelector(feed);}}>

        <Text style={[styles.selector, textSelectedStyle]}>
          {feed}
        </Text>
      </TouchableHighlight>
    );
  },

  _changeFeedSelector: function(feed) {
    if (feed !== this.state.selectedFeed) {
      this.setState({
        selectedFeed: feed
      });
      this._requestTrendingUsers(feed);
    }
  },

  _requestTrendingUsers: function(feed) {
    if (feed === this.weeklyFeed) {
      Unicycle.exec('getTrendingUsers');
    }
    else if (feed === this.allTimeFeed) {
      Unicycle.exec('getAllTimeTrendingUsers');
    }
  }

});

module.exports = TrendingPageSelector;
