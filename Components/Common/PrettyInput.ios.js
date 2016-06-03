'use strict';

var React = require('react-native');
var Colors = require('../../Utils/Common/GlobalColorMap');

var {
  TextInput,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  container: {
    color: 'white',
    backgroundColor: Colors.YOUNI_PRIMARY_PURPLE,
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
    style: React.PropTypes.object,
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
        style={[styles.container, this.props.style]}
        value={this.state.value}
        secureTextEntry={this.props.secureTextEntry}
        clearTextOnFocus={this.props.clearTextOnFocus}
        onChangeText={this._onTextChange}
        placeholderTextColor='white'
        placeholder={this.props.placeholder}
        keyboardType={this.props.keyboardType}/>
    );
  },

  _onTextChange: function(text) {
    this.setState({
      value: text
    });
    if (this.props.onTextChange) {
      this.props.onTextChange();
    }
  }

});

module.exports = PrettyInput;
