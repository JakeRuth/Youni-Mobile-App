'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Spinner = require('../Common/Spinner');
var Color = require('../../Utils/Common/Colors');

var {
  View,
  Text,
  TouchableHighlight,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    height: 30,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    padding: 10,
    margin: 3
  },
  text: {
    fontSize: 13
  }
});

var LoadMoreButton = React.createClass({

  propTypes: {
    onPress: React.PropTypes.func.isRequired,
    isLoading: React.PropTypes.bool,
    isVisible: React.PropTypes.bool
  },

  render: function() {
    var content;

    if (!this.props.isVisible) {
      return <View/>;
    }
    else if (this.props.isLoading) {
      return (
        <View style={styles.container}>
          <Spinner/>
        </View>
      );
    }
    else {
      return (
        <TouchableHighlight
          style={[styles.container, this.props.style, { backgroundColor: Color.getPrimaryAppColor() }]}
          underlayColor={Color.getPrimaryAppColor()}
          onPress={this.props.onPress}>

          <Text style={styles.text}>
            Load more
          </Text>

        </TouchableHighlight>
      );
    }
  }

});

module.exports = LoadMoreButton;
