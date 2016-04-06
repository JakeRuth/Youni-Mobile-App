var React = require('react-native');
var nodeEmoji = require('node-emoji');

var {
  Text
} = React;

var Emoji = React.createClass({

  propTypes: {
    name: React.PropTypes.string.isRequired,
    size: React.PropTypes.number.isRequired,
    style: React.PropTypes.obj
  },

  render: function() {
    var emoji = nodeEmoji.get(this.props.name),
        styles = [{
          fontSize: this.props.size,
          textAlign: 'center'
        }];

    if (this.props.style) {
      styles.push(this.props.style);
    }

    return (
      <Text style={styles}>
        {emoji}
      </Text>
    );
  }

});

module.exports = Emoji;
