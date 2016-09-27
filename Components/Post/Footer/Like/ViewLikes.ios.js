'use strict';

var React = require('react');
var ReactNative = require('react-native');

var Colors = require('../../../../Utils/Common/Colors');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    paddingBottom: 5
  },
  label: {
    color: Colors.MED_GRAY,
    fontSize: 12,
    fontWeight: '600'
  }
});

var ViewLikes = React.createClass({

  propTypes: {
    numLikes: React.PropTypes.number,
    onPress: React.PropTypes.func.isRequired
  },

  render: function() {
    if (this.props.numLikes) {
      return (
        <TouchableHighlight
          style={styles.container}
          onPress={this.props.onPress}
          underlayColor='transparent'>
          <Text style={styles.label}>
            {this._getLabel()}
          </Text>
        </TouchableHighlight>
      );
    }
    else {
      return <View/>;
    }
  },

  _getLabel: function() {
    if (this.props.numLikes === 1) {
      return 'View 1 like';
    }
    else {
      return `View ${this.props.numLikes} likes`;
    }
  }

});

module.exports = ViewLikes;
