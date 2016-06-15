'use strict';

var React = require('react-native');
var Colors = require('../../Utils/Common/Colors');

var {
  View,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  container: {
    height: 70,
    backgroundColor: 'limegreen'
  }
});


// this is merely a place holder... for now!
var ProfileInfoFooter = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    return (
      <View style={styles.container}>

      </View>
    );
  }

});

module.exports = ProfileInfoFooter;
