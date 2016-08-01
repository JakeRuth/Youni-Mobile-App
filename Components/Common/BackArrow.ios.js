'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');

var Colors = require('../../Utils/Common/Colors');

var {
  View,
  StyleSheet,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    paddingTop: 25,
    paddingLeft: 12,
    paddingRight: 30,
    paddingBottom: 15
  }
});

var BackArrow = React.createClass({

  propTypes: {
    onPress: React.PropTypes.func.isRequired
  },

  render: function () {
    return (
      <TouchableHighlight
        style={styles.container}
        underlayColor='transparent'
        onPress={this.props.onPress}>

        <View style={this.props.style}>
          <Icon
            name='ios-arrow-back'
            size={30}
            color={Colors.YOUNI_PRIMARY}/>
        </View>

      </TouchableHighlight>
    );
  }

});

module.exports = BackArrow;
