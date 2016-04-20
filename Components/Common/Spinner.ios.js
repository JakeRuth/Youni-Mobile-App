'use strict';

var React = require('react-native');
var Color = require('../../Utils/Common/GlobalColorMap');

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
  render: function() {
    return(
      <View style={styles.container}>
        <ActivityIndicatorIOS
          size={'small'}
          color={Color.SPINNER}/>
      </View>
    );
  }
});

module.exports = Spinner;
