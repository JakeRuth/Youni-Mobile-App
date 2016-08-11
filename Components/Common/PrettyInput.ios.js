'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Colors = require('../../Utils/Common/Colors');

var {
  TextInput,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    color: 'white',
    borderRadius: 4,
    borderColor: 'white',
    borderWidth: 1,
    paddingTop: 13,
    paddingBottom: 13,
    paddingLeft: 20,
    paddingRight: 20
  }
});

var PrettyInput = React.createClass({

  propTypes: {
    keyboardType: React.PropTypes.string,
    secureTextEntry: React.PropTypes.bool,
    clearTextOnFocus: React.PropTypes.bool,
    placeholder: React.PropTypes.string.isRequired,
    onTextChange: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      value: ''
    };
  },

  render: function() {
    return (
      <TextInput
        {...this.props}
        style={[styles.container, { backgroundColor: Colors.getPrimaryAppColor() }, this.props.style]}
        value={this.state.value}
        onChangeText={this._onTextChange}
        placeholderTextColor={Colors.LIGHT_GRAY}/>
    );
  },

  _onTextChange: function(text) {
    this.setState({
      value: text
    });
    if (this.props.onTextChange) {
      this.props.onTextChange(text);
    }
  }

});

module.exports = PrettyInput;
