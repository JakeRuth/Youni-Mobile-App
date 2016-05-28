'use strict';

var React = require('react-native');

var {
  Text,
  StyleSheet,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  container: {
    marginBottom: 6,
    marginTop: 6
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#B2B2B2'
  }
});

var ViewAllCommentsLink = React.createClass({

  propTypes: {
    post: React.PropTypes.object.isRequired,
    onSubmitCommentCallback: React.PropTypes.func.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    return (
      <TouchableHighlight
        style={styles.container}
        underlayColor='transparent'
        onPress={this._onViewAllCommentsPress}>

        <Text style={styles.viewAllText}>
          View all {this.props.post.numComments} comments
        </Text>

      </TouchableHighlight>
    );
  },

  _onViewAllCommentsPress: function() {
    var postCommentsPopup = require('../../PopupPages/PostCommentsPopup');
    this.props.navigator.push({
      component: postCommentsPopup,
      passProps: {
        post: this.props.post,
        onSubmitCommentCallback: this.props.onSubmitCommentCallback
      }
    });
  }

});

module.exports = ViewAllCommentsLink;
