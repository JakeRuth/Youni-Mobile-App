var React = require('react-native');
var nodeEmoji = require('node-emoji');

var {
  Text
} = React;

var Emoji = React.createClass({

  propTypes: {
    name: React.PropTypes.string.isRequired,
    size: React.PropTypes.number.isRequired
  },

  render: function() {
    var emoji = nodeEmoji.get(this.props.name);

    return (
      <Text
        style={
          {
            fontSize: this.props.size,
            textAlign: 'center'
          }
        }>
        {emoji}
      </Text>
    );
  }

});

module.exports = Emoji;
