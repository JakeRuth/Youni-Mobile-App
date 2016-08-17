'use strict';

var React = require('react');
var ReactNative = require('react-native');

var PostLikesPopup = require('../../../PopupPages/PostLikesPopup');

var Colors = require('../../../../Utils/Common/Colors');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    paddingBottom: 5
  },
  label: {
    color: Colors.MED_GRAY,
    fontSize: 12,
    fontWeight: '600'
  }
});

var ViewPostLikes = React.createClass({

  propTypes: {
    post: React.PropTypes.object.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    if (this.props.post.numLikes) {
      return (
        <TouchableHighlight
          style={styles.container}
          onPress={this._onPress}
          underlayColor='transparent'>
          <Text style={styles.label}>
            {this._getLabel()}
          </Text>
        </TouchableHighlight>
      );
    }
    else {
      return <View/>;
    }
  },

  _onPress: function() {
    this.props.navigator.push({
      component: PostLikesPopup,
      passProps: {
        postId: this.props.post.postIdString
      }
    })
  },

  _getLabel: function() {
    if (this.props.post.numLikes === 1) {
      return 'View 1 like';
    }
    else {
      return `View ${this.props.post.numLikes} likes`;
    }
  }

});

module.exports = ViewPostLikes;
