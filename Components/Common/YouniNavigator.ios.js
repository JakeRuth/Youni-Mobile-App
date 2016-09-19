'use strict';

var React = require('react');
var ReactNative = require('react-native');

var {
  StyleSheet,
  Navigator,
  Dimensions
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

var YouniNavigator = React.createClass({

  render: function() {
    var FloatFromRight = {
      ...Navigator.SceneConfigs.FloatFromRight,
      gestures: {
        pop: {
          ...Navigator.SceneConfigs.FloatFromRight.gestures.pop,
          edgeHitWidth: Dimensions.get('window').width / 2
        }
      }
    };

    return (
      <Navigator 
        style={styles.container}
        configureScene={() => FloatFromRight}
        {...this.props}/>
    );
  }

});

module.exports = YouniNavigator;
