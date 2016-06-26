'use strict';

var React = require('react-native');
var Colors = require('../../Utils/Common/Colors');

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
    return(
      <View style={[styles.container, this.props.style]}>
        <ActivityIndicatorIOS
          size={'small'}
          color={this.props.color ? this.props.color : Colors.YOUNI_PRIMARY_PURPLE}/>
      </View>
    );
  }
});

module.exports = Spinner;
