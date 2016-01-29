'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Unicycle = require('../../Unicycle');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var {
  View,
  Image,
  Text,
  StyleSheet,
  NativeModules,
  TouchableHighlight,
  ActivityIndicatorIOS
} = React

var styles = StyleSheet.create({
  spinnerContainer: {
    borderRadius: 10,
    alignItems: 'center',
    padding: 10
  }
});

var Spinner = React.createClass({

    render: function() {
      return(
        <View style={styles.spinnerContainer}>
          <ActivityIndicatorIOS size={'small'} color="red"/>
        </View>
      );
    }
});

module.exports = Spinner;
