'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Unicycle = require('../../Unicycle');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var {
  View,
  StyleSheet,
  ActivityIndicatorIOS
} = React

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
          color={'black'}/>
      </View>
      );
    }
  });

module.exports = Spinner;
