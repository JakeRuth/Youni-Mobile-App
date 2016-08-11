'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Colors = require('../../../Utils/Common/Colors');

var {
  Text,
  StyleSheet,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    marginBottom: 8
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '100',
    color: Colors.MED_GRAY
  }
});

var ViewAllCommentsLink = React.createClass({

  propTypes: {
    post: React.PropTypes.object.isRequired,
    onSubmitCommentAction: React.PropTypes.func.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    return (
      <TouchableHighlight
        style={styles.container}
        underlayColor='transparent'
        onPress={this._onViewAllCommentsPress}>

        <Text style={styles.viewAllText}>
          View all comments
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
        onSubmitCommentAction: this.props.onSubmitCommentAction
      }
    });
  }

});

module.exports = ViewAllCommentsLink;
