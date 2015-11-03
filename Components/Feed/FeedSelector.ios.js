'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var feedSelectorStore = require('../../stores/FeedSelectorStore');

var {
  View,
  Text,
  StyleSheet
} = React

var styles = StyleSheet.create({
  feedSelectorContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  feedOption: {
    flex: 1
  },
  feedOptionSelected: {
    flex: 1,
    borderColor: '#007C9E',
    borderBottomWidth: 1,
    margin: 2
  },
  feedOptionText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Snell Roundhand',
    textAlign: 'center',
    color: 'gray'
  },
  feedOptionTextSelected: {
    flex: 1,
    fontSize: 20,
    fontFamily: 'Snell Roundhand',
    textAlign: 'center',
    fontWeight: '300'
  }
});

var FeedSelector = React.createClass({

  mixins: [
    Unicycle.listenTo(feedSelectorStore)
  ],

  propTypes: {
    feedType: React.PropTypes.string.isRequired
  },

  render: function() {
    var selectedFeed = feedSelectorStore.getCurrentFeed();

    return (
      <View>
        { this.renderSelectedFeed(selectedFeed) }
      </View>
    );
  },

  renderSelectedFeed: function(selectedFeed) {
    if (selectedFeed == feedSelectorStore.FeedType().FULL) {
      return (
        <View style={styles.feedSelectorContainer}>
          <View style={styles.feedOptionSelected}>
            <Text style={styles.feedOptionTextSelected}>Youni</Text>
          </View>

          <View style={styles.feedOption}>
            <Text style={styles.feedOptionText} onPress={ this._selectorOnClickAction() }>Me</Text>
          </View>
        </View>
      );
    }
    else {
      return (
        <View style={styles.feedSelectorContainer}>
          <View style={styles.feedOption}>
            <Text style={styles.feedOptionText} onPress={ this._selectorOnClickAction() }>Youni</Text>
          </View>

          <View style={styles.feedOptionSelected}>
            <Text style={styles.feedOptionTextSelected}>Me</Text>
          </View>
        </View>
      );
    }
  },

  _selectorOnClickAction: function() {
    return () => {
      Unicycle.exec('toggleFeed');
    }
  }

});

module.exports = FeedSelector;
