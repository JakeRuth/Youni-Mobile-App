'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var PostLikeText = require('./Like/PostLikeText');

var {
  View,
  StyleSheet,
  TouchableHighlight,
  AlertIOS
} = React

var styles = StyleSheet.create({
  postStatsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    color: '#B2B2B2',
    marginTop: 6,
    marginBottom: 6,
    marginRight: 8,
    marginLeft: 8
  }
});

var PostStats = React.createClass({

  propTypes: {
    postStore: React.PropTypes.any.isRequired,
    onStarPress: React.PropTypes.func,
    post: React.PropTypes.object.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    var likedStarIconColor = {};

    if (this.props.post.liked) {
      likedStarIconColor = {
        color: '#FCDD00'
      };
    }

    return (
      <View style={styles.postStatsContainer}>

        <TouchableHighlight
          onPress={this.props.onStarPress}
          underlayColor={'transparent'}>
          <Icon
            style={[styles.icon, likedStarIconColor]}
            name={this._getStarIconName()}
            size={33}/>
        </TouchableHighlight>

        <Icon
          style={[styles.icon, {flex:1}]}
          name='ios-chatbubble-outline'
          size={33}
          color='#0083D4'/>

        <PostLikeText
          navigator={this.props.navigator}
          numComments={this.props.post.numComments}
          postStore={this.props.postStore}
          numLikes={this.props.post.numLikes}
          postIdString={this.props.post.postIdString} />

      </View>
    );
  },

  _getStarIconName: function() {
      if (this.props.postStore.isLikeRequestInFlight()) {
        return 'ios-star-half';
      }
      else if (this.props.post.liked) {
        return 'ios-star';
      }
      else {
        return 'ios-star-outline';
      }
  }

});

module.exports = PostStats;
