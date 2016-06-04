'use strict';

var React = require('react-native');

var {
  View,
  StyleSheet,
  ActivityIndicatorIOS
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

var Spinner = React.createClass({

  propTypes: {
    color: React.PropTypes.string
  },

  render: function() {
    var color;

    if (this.props.color) {
      color = this.props.color;
    }
    else {
      color = 'black';
    }

    return(
      <View style={styles.container}>
        <ActivityIndicatorIOS
          size={'small'}
          color={color}/>
      </View>
    );
  }
});

module.exports = Spinner;
