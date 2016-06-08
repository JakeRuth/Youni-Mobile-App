'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var Emoji = require('../Common/Emoji');
var Color = require('../../Utils/Common/Colors');

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
    borderBottomColor: Color.YOUNI_PRIMARY_PURPLE
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

  propTypes: {
    selectedFeed: React.PropTypes.string.isRequired,
    currentFeed: React.PropTypes.string.isRequired,
    weeklyFeed: React.PropTypes.string.isRequired,
    allTimeFeed: React.PropTypes.string.isRequired,
    changeFeedSelector: React.PropTypes.func.isRequired
  },


  render: function() {
    return (
      <View style={styles.container}>

        {this._renderFeedSelector(this.props.currentFeed)}
        {this._renderFeedSelector(this.props.weeklyFeed)}
        {this._renderFeedSelector(this.props.allTimeFeed)}

      </View>
    );
  },

  _renderFeedSelector: function(feed) {
    var textSelectedStyle = {},
        containerSelectedStyle = {};

    if (feed == this.props.selectedFeed) {
      textSelectedStyle = styles.selectedSelector;
      containerSelectedStyle = styles.selectedFeedSelector;
    }

    return (
      <TouchableHighlight
        style={[styles.feedSelector, containerSelectedStyle]}
        underlayColor={'transparent'}
        onPress={() => {this.props.changeFeedSelector(feed);}}>

        <Text style={[styles.selector, textSelectedStyle]}>
          {feed}
        </Text>
      </TouchableHighlight>
    );
  }

});

module.exports = TrendingPageSelector;
