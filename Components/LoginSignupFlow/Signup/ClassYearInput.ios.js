'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var PrettyTouchable = require('../../Common/PrettyTouchable');

var {
  View,
  StyleSheet,
  Dimensions
} = React;

var styles = StyleSheet.create({
  dropdownCaretContainer: {
    position: 'absolute',
    right: 10,
    top: 13
  }
});

var ClassYearInput = React.createClass({

  propTypes: {
    value: React.PropTypes.string,
    onPress: React.PropTypes.func.isRequired
  },

  render: function() {
    var label = this.props.value;

    if (!label) {
      label = 'Class Year';
    }

    return (
      <View>
        <PrettyTouchable
          label={label}
          containerStyle={{
            width: Dimensions.get('window').width * .8,
            height: 44
          }}
          labelContainerStyle={{
            alignItems: 'flex-start'
          }}
          onPress={this.props.onPress}/>

        {this._renderDropDownCaret()}
      </View>
    );
  },

  _renderDropDownCaret: function() {
    return (
      <View style={styles.dropdownCaretContainer}>
        <Icon
          name='android-arrow-dropdown'
          size={20}
          color='white'/>
      </View>
    )
  }

});

module.exports = ClassYearInput;
