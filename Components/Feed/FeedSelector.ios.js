'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var postStore = require('../../stores/PostStore');
var feedSelectorStore = require('../../stores/FeedSelectorStore');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

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
    borderBottomWidth: 1
  },
  feedOptionText: {
    flex: 1,
    fontSize: 20,
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
    Unicycle.listenTo(feedSelectorStore),
    Unicycle.listenTo(postStore)
  ],

  render: function() {
    return (
      <View>
        { this.renderSelectedFeed() }
      </View>
    );
  },

  //TODO: Look into a way to clean this up, there has to be a better way
  //Maybe more components, or reuse of jsx somehow?
  renderSelectedFeed: function(selectedFeed) {
    var isRequestInFlight = postStore.getIsRequestInFlight(),
        selectedFeed = feedSelectorStore.getCurrentFeed();

    if (isRequestInFlight) {
      return (
        <View style={styles.feedSelectorContainer}>
          <View style={styles.feedOption}>
            <Text style={styles.feedOptionText}>Youni</Text>
          </View>

          <View style={styles.feedOption}>
            <Text style={styles.feedOptionText}>Me</Text>
          </View>
        </View>
      );
    }
    else if (selectedFeed == feedSelectorStore.FeedType().FULL) {
      return (
        <View style={styles.feedSelectorContainer}>
          <View style={styles.feedOptionSelected}>
            <Text style={styles.feedOptionTextSelected}>Youni</Text>
          </View>

          <View style={styles.feedOption}>
            <Text style={styles.feedOptionText}
              onPress={ this._selectorOnClickAction(feedSelectorStore.FeedType().ME) }>Me</Text>
          </View>
        </View>
      );
    }
    else {
      return (
        <View style={styles.feedSelectorContainer}>
          <View style={styles.feedOption}>
            <Text style={styles.feedOptionText}
              onPress={ this._selectorOnClickAction(feedSelectorStore.FeedType().FULL) }>Youni</Text>
          </View>

          <View style={styles.feedOptionSelected}>
            <Text style={styles.feedOptionTextSelected}>Me</Text>
          </View>
        </View>
      );
    }
  },

  _selectorOnClickAction: function(desiredFeed) {
    return () => {
      var userId = userLoginMetadataStore.getUserId();;
      if (desiredFeed == feedSelectorStore.FeedType().FULL) {
        Unicycle.exec('requestExploreFeed', userId);
      }
      else {
        Unicycle.exec('requestHomeFeed', userId);
      }
      Unicycle.exec('toggleFeed');
    }
  }

});

module.exports = FeedSelector;
