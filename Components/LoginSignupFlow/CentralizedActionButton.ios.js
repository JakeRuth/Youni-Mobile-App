'use strict';

var React = require('react-native');
var PrettyTouchable = require('../Common/PrettyTouchable');

var {
  View,
  StyleSheet,
  Dimensions
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

var CentralizedActionButton = React.createClass({

  propTypes: {
    label: React.PropTypes.string.isRequired,
    onPress: React.PropTypes.func.isRequired
  },

  render: function() {
    return (
      <View style={styles.container}>
        <PrettyTouchable
          label={this.props.label}
          containerStyle={{
            width: Dimensions.get('window').width * .8,
            height: 44
          }}
          invertColors={true}
          onPress={this.props.onPress}/>
      </View>
    );
  }

});

module.exports = CentralizedActionButton;
