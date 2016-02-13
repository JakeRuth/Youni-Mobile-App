'use strict';

var React = require('react-native');
var Unicycle = require('../../../Unicycle');

var {
  View,
  Text,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 8,
    marginRight: 8
  },
  commenterName: {
    fontSize: 12,
    color: '#0083D4',
    marginRight: 4
  },
  commentText: {
    flex: 1,
    fontSize: 12,
    color: '#525252'
  }
});

var Comment = React.createClass({

  propTypes: {
    commenterName: React.PropTypes.string.isRequired,
    commentText: React.PropTypes.string.isRequired
  },

  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.commenterName}>
          {this.props.commenterName}:
        </Text>
        <Text style={styles.commentText}>
          {this.props.commentText}
        </Text>
      </View>
    );
  }

});

module.exports = Comment;
