'use strict';

var React = require('react-native');

var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Text,
  TextInput,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flexDirection: 'row',
    height: 44,
    padding: 10
  },
  label: {
    fontWeight: '100',
    color: Colors.DARK_GRAY,
    fontSize: 16
  },
  input: {
    flex: 1,
    textAlign: 'right',
    fontSize: 16,
    color: Colors.DARK_GRAY
  }
});

var EditProfileFieldInput = React.createClass({

  propTypes: {
    label: React.PropTypes.string.isRequired,
    value: React.PropTypes.string.isRequired,
    placeholder: React.PropTypes.string.isRequired,
    onChangeText: React.PropTypes.func.isRequired,
    maxLength: React.PropTypes.number.isRequired
  },

  render: function() {
    return (
      <View style={styles.container}>
        
        <Text style={styles.label}>
          {this.props.label}
        </Text>
        
        <TextInput
          {...this.props}
          style={styles.input}
          placeholderTextColor={Colors.MED_GRAY}/>
        
      </View>
    );
  }

});

module.exports = EditProfileFieldInput;
