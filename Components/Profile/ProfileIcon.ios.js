'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');

var ProfileOwnerPage = require('./ProfileOwnerPage');

var {
  TouchableHighlight
} = ReactNative;

var ProfileIcon = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    return (
      <TouchableHighlight
        onPress={() => this.props.navigator.push({
          component: ProfileOwnerPage
        })}
        underlayColor='transparent'
        style={this.props.style}>
        <Icon
          name='person'
          size={30}
          color='white'/>
      </TouchableHighlight>
    );
  }

});

module.exports = ProfileIcon;
