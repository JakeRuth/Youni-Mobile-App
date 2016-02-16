'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var {
  View,
  Text,
  StyleSheet
} = React

var styles = StyleSheet.create({
  emptySearchResultsContainer: {
    flex: 1
  },
  emptySearchText: {
    flex: 1,
    alignSelf: 'center',
    marginTop: 200,
    color: 'darkgray'
  },
});

var EmptyResults = React.createClass({

  propTypes: {
    message: React.PropTypes.string
  },

  render: function() {
    return (
      <View style={styles.emptySearchResultsContainer}>
        <Text style={styles.emptySearchText}>{this.props.message}</Text>
      </View>
    )
  }

});

module.exports = EmptyResults;
