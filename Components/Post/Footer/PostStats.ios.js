'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var PostLikeText = require('./Like/PostLikeText');
var Color = require('../../../Utils/Common/GlobalColorMap');

var {
  View,
  StyleSheet,
  TouchableHighlight,
  AlertIOS
} = React;

var styles = StyleSheet.create({
  postStatsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    color: '#B2B2B2',
    marginRight: 8,
    marginLeft: 8
  }
});

var PostStats = React.createClass({

  propTypes: {
    onStarPress: React.PropTypes.func,
    onCommentPress: React.PropTypes.func,
    post: React.PropTypes.object.isRequired,
    isLikeRequestInFlight: React.PropTypes.bool,
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

        <TouchableHighlight
          style={{flex: 1}}
          onPress={this.props.onCommentPress}
          underlayColor={'transparent'}>
          <Icon
            style={[styles.icon]}
            name='ios-chatbubble-outline'
            size={33}
            color={Color.YOUNI_PRIMARY_PURPLE}/>
        </TouchableHighlight>

        <PostLikeText
          navigator={this.props.navigator}
          numComments={this.props.post.numComments}
          loading={this.props.isLikeRequestInFlight}
          numLikes={this.props.post.numLikes}
          numViews={this.props.post.numViews}
          postIdString={this.props.post.postIdString} />

      </View>
    );
  },

  _getStarIconName: function() {
      if (this.props.isLikeRequestInFlight) {
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
