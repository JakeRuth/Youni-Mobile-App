'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');

var AppNavigationState = require('../../Utils/Enums/AppNavigationState');

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
        onPress={() => this.props.navigator.push(AppNavigationState.PROFILE_OWNER_ROUTE)}
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
