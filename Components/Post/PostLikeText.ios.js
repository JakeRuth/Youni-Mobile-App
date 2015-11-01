'use strict';

var React = require('react-native');
var postStore = require('../../stores/PostStore');

var {
  View,
  Text,
  StyleSheet,
  ActivityIndicatorIOS
} = React

var styles = StyleSheet.create({
  numLikes: {
    alignSelf: 'center',
    color: 'darkblue',
    fontSize: 10,
    fontWeight: '600',
    margin: 3
  }
});

var PostLikeText = React.createClass({

  propTypes: {
    numLikes: React.PropTypes.number.isRequired
  },

  render: function() {
    if (postStore.isLikeRequestInFlight()) {
      return ( <ActivityIndicatorIOS style={styles.numLikes}/> );
    }
    else {
      return (
          <Text style={styles.numLikes}>
            {this._getLikesText(this.props.numLikes)}
          </Text>
      );
    }
  },

  //TODO: this should be handled by the api
  _getLikesText(numLikes) {
    if (numLikes > 1) {
      return numLikes + ' likes';
    }
    else if (numLikes === 1) {
      return numLikes + ' like';
    }
    else {
      return 'no likes... yet';
    }
  }

});

module.exports = PostLikeText;
