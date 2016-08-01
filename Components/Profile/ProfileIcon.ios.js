'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var ProfilePage = require('./ProfilePage');

var {
  TouchableHighlight
} = React;

var ProfileIcon = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    return (
        <TouchableHighlight
          onPress={()=>{
            this.props.navigator.push({
              component: ProfilePage
            });
          }}
          style={this.props.style}
          underlayColor='transparent'>
          <Icon
            name='person'
            size={30}
            color='white'/>
        </TouchableHighlight>
    );
  }

});

module.exports = ProfileIcon;
