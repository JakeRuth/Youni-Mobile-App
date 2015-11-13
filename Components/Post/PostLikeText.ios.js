'use strict';

var React = require('react-native');
var postStore = require('../../stores/PostStore');
var Icon = require('react-native-vector-icons/Ionicons');

var {
  View,
  Text,
  StyleSheet,
  ActivityIndicatorIOS
} = React

var styles = StyleSheet.create({
  likeContainer: {
    flex: 1,
    flexDirection: 'row',
    margin: 5,
    marginLeft: 30,
    marginRight: 30,
    alignItems: 'center'
  },
  star: {
    flex: 1
  },
  numLikes: {
    color: 'darkblue',
    fontSize: 13,
    fontWeight: '600'
  }
});

var PostLikeText = React.createClass({

  propTypes: {
    numLikes: React.PropTypes.number.isRequired,
    liked: React.PropTypes.bool.isRequired,
  },

  render: function() {
    var numLikes;
    if (postStore.isLikeRequestInFlight()) {
      numLikes = ( <ActivityIndicatorIOS size={'small'} style={styles.spinner}/> );
    }
    else {
      numLikes = (
        <Text style={styles.numLikes}>
          {this._getLikesText(this.props.numLikes)}
        </Text>
      );
    }

    return (
      <View style={styles.likeContainer}>
        <Icon style={styles.star} name={this._getStarIconName()} size={25} color='gold' />
        { numLikes }
      </View>
    );
  },

  _getStarIconName: function() {
      var iconName;
      if (this.props.liked) {
        iconName = 'ios-star';
      }
      else {
        iconName = 'android-star-outline';
      }
      return iconName;
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
