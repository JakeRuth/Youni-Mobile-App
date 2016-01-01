'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var PostLikeText = require('./PostLikeText');

var {
  View,
  StyleSheet,
  TouchableHighlight,
  AlertIOS
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
  }
});

var PostLikeBar = React.createClass({

  propTypes: {
    postStore: React.PropTypes.any.isRequired,
    onStarPress: React.PropTypes.func,
    numLikes: React.PropTypes.number.isRequired,
    liked: React.PropTypes.bool.isRequired,
    postIdString: React.PropTypes.string.isRequired
  },

  render: function() {
    return (
      <View style={styles.likeContainer}>

        <TouchableHighlight
          onPress={this.props.onStarPress}
          underlayColor={'transparent'}
          style={styles.star}>
          <Icon name={this._getStarIconName()} size={30} color='gold' />
        </TouchableHighlight>

        <PostLikeText
          postStore={this.props.postStore}
          numLikes={this.props.numLikes}
          postIdString={this.props.postIdString} />

      </View>
    );
  },

  _getStarIconName: function() {
      if (this.props.liked) {
        return 'ios-star';
      }
      else {
        return 'android-star-outline';
      }
  }

});

module.exports = PostLikeBar;
