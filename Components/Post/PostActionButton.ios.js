'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');

var Colors = require('../../Utils/Common/Colors');

var {
  TouchableHighlight
} = ReactNative;

var PostActionButton = React.createClass({

  propTypes: {
    onPress: React.PropTypes.func.isRequired,
    enabled: React.PropTypes.bool
  },

  render: function() {
    return (
      <TouchableHighlight
        underlayColor='transparent'
        onPress={this.props.onPress}>

        <Icon
          name="more-horiz"
          size={30}
          color={Colors.DARK_GRAY}/>

      </TouchableHighlight>
    );
  }

});

module.exports = PostActionButton;
