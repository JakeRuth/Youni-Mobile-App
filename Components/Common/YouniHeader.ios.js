'use strict';

var React = require('react-native');
var Color = require('../../Utils/Common/Colors');

var {
  View,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  container: {
    height: 64,
    backgroundColor: Color.YOUNI_PRIMARY_PURPLE,
    paddingTop: 28
  }
});

var YouniHeader = React.createClass({

  render: function() {
    return (
      <View style={styles.container}>
        {this.props.children ? this.props.children : <View/>}
      </View>
    );
  }

});

module.exports = YouniHeader;
