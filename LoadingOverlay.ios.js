var React = require('react-native');
var Overlay = require('react-native-overlay');
//var BlurView = require('react-native-blur').BlurView;

var {
  View,
  ActivityIndicatorIOS,
  StyleSheet,
} = React;

/* This file was copied from (with some modifications) https://github.com/brentvatne/react-native-overlay */
var LoadingOverlay = React.createClass({
  getDefaultProps(): StateObject {
    return {
      isVisible: false
    }
  },

  render(): ReactElement {
    return (
      <Overlay style={styles.background} isVisible={this.props.isVisible}>
          <ActivityIndicatorIOS
            size="small"
            color="black"
            animating={true}
            style={styles.spinner} />
      </Overlay>
    );
  }
});

var styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

module.exports = LoadingOverlay;
