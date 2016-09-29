'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Unicycle = require('../../Unicycle');

var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Text,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  emptySearchResultsContainer: {
    flex: 1
  },
  emptySearchText: {
    flex: 1,
    alignSelf: 'center',
    marginTop: 200,
    color: Colors.DARK_GRAY
  }
});

var EmptyResults = React.createClass({

  propTypes: {
    message: React.PropTypes.string,
    textStyle: React.PropTypes.object
  },

  render: function() {
    return (
      <View style={styles.emptySearchResultsContainer}>
        <Text style={[styles.emptySearchText, this.props.textStyle]}>
          {this.props.message}
        </Text>
      </View>
    )
  }

});

module.exports = EmptyResults;
