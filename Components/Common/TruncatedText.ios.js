'use strict';

var React = require('react');
var ReactNative = require('react-native');

var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Text,
  TouchableHighlight,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  commentText: {
    textAlign: 'left',
    fontSize: 16,
    fontWeight: '300',
    color: Colors.DARK_GRAY
  },
  showMoreButton: {
    alignSelf: 'flex-start'
  },
  showMoreButtonLabel: {
    fontSize: 14,
    color: Colors.MED_GRAY
  }
});

var TruncatedText = React.createClass({

  INITIAL_NUM_LINES: 3,
  MAX_TEXT_HEIGHT_BEFORE_TRUNCATION: 50,

  propTypes: {
    text: React.PropTypes.string.isRequired
  },

  getInitialState: function() {
    return {
      shouldTruncate: false,
      numberOfLines: this.INITIAL_NUM_LINES
    }
  },

  render: function() {
    return (
      <View>
        <Text
          style={[styles.commentText, this.props.style]}
          numberOfLines={this.state.numberOfLines}
          onLayout={this._onLayout}>
          {this.props.text}
        </Text>

        {this._renderShowMoreButton()}
      </View>
    );
  },

  _renderShowMoreButton: function() {
    if (this.state.shouldTruncate) {
      return (
        <TouchableHighlight
          style={styles.showMoreButton}
          underlayColor="transparent"
          onPress={() => this.setState({
            shouldTruncate: false,
            numberOfLines: null
          })}>
          <Text style={styles.showMoreButtonLabel}>
            Show more...
          </Text>
        </TouchableHighlight>
      );
    }
  },

  _onLayout: function(event) {
    var commentHeight = event.nativeEvent.layout.height;

    if (this.state.numberOfLines && commentHeight > this.MAX_TEXT_HEIGHT_BEFORE_TRUNCATION) {
      this.setState({
        shouldTruncate: true
      });
    }
  }

});

module.exports = TruncatedText;
