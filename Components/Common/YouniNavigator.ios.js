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
    backgroundColor: 'white'
  }
});

var YouniNavigator = React.createClass({

  render: function() {
    var FloatFromRight = {
      ...Navigator.SceneConfigs.FloatFromRight,
      gestures: {
        pop: {
          ...Navigator.SceneConfigs.FloatFromRight.gestures.pop,
          edgeHitWidth: Dimensions.get('window').width / 3
        }
      }
    };

    return (
      <Navigator
        sceneStyle={styles.container}
        configureScene={() => FloatFromRight}
        {...this.props}/>
    );
  }

});

module.exports = YouniNavigator;
