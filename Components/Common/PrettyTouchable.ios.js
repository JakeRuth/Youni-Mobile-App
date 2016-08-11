'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Colors = require('../../Utils/Common/Colors');

var {
  TouchableOpacity,
  Text,
  View,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    borderColor: 'white',
    borderWidth: 1
  },
  invertedContainer: {
    backgroundColor: 'white'
  },
  labelContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  label: {
    color: 'white',
    fontSize: 18
  }
});

var PrettyTouchable = React.createClass({

  propTypes: {
    label: React.PropTypes.string.isRequired,
    containerStyle: React.PropTypes.object,
    labelStyle: React.PropTypes.object,
    labelContainerStyle: React.PropTypes.object,
    invertColors: React.PropTypes.bool,
    onPress: React.PropTypes.func
  },

  render: function() {
    var containerStyles = [styles.container, { backgroundColor: Colors.getPrimaryAppColor() }, this.props.containerStyle],
        labelStyles = [styles.label, this.props.labelStyle];

    if (this.props.invertColors) {
      containerStyles.push([styles.invertedContainer, { borderColor: Colors.getPrimaryAppColor() }]);
      labelStyles.push({ color: Colors.getPrimaryAppColor() });
    }

    return (
      <TouchableOpacity
        style={containerStyles}
        onPress={this.props.onPress ? this.props.onPress : ()=>null}
        underlayColor="transparent"
        activeOpacity={.7}>

        {this._renderLabel(labelStyles)}

      </TouchableOpacity>
    );
  },

  _renderLabel: function(labelStyles) {
    return (
      <View style={[styles.labelContainer, this.props.labelContainerStyle]}>
        <Text style={labelStyles}>
          {this.props.label}
        </Text>
      </View>
    );
  }

});

module.exports = PrettyTouchable;
