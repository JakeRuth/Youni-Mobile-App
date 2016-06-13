'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Colors = require('../../../Utils/Common/Colors');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  AlertIOS
} = React;

var ICON_SIZE = 25;

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12
  },
  statContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: ICON_SIZE
  },
  // this is needed because the actual icon itself has more whitespace on the bottom than on the top
  commentIcon: {
    marginTop: 3
  },
  iconLabel: {
    alignSelf: 'center',
    color: Colors.MED_GRAY,
    fontSize: 20,
    fontWeight: '200',
    paddingLeft: 4,
    paddingRight: 12.5
  }
});

var PostStats = React.createClass({

  propTypes: {
    onStarPress: React.PropTypes.func,
    onCommentPress: React.PropTypes.func,
    post: React.PropTypes.object.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    var likedStarIconColor = { color: '' };

    if (this.props.post.liked) {
      likedStarIconColor.color = '#FFE700';
    }
    else {
      likedStarIconColor.color = Colors.MED_GRAY;
    }

    return (
      <View style={styles.container}>
        <TouchableHighlight
          onPress={this.props.onStarPress}
          underlayColor={'transparent'}>

          <View style={styles.statContainer}>
            <Icon
              style={likedStarIconColor}
              name={this._getStarIconName()}
              size={ICON_SIZE}/>
            <Text style={styles.iconLabel}>
              {this.props.post.numLikes}
            </Text>
          </View>

        </TouchableHighlight>

        <TouchableHighlight
          onPress={this.props.onCommentPress}
          underlayColor={'transparent'}>

          <View style={styles.statContainer}>
            <Icon
              style={styles.commentIcon}
              name='ios-chatbubble-outline'
              size={ICON_SIZE}
              color={Colors.MED_GRAY}/>
            <Text style={styles.iconLabel}>
              {this.props.post.numLikes}
            </Text>
          </View>

        </TouchableHighlight>
      </View>
    );
  },

  _getStarIconName: function() {
      if (this.props.post.liked) {
        return 'ios-star';
      }
      else {
        return 'ios-star-outline';
      }
  }

});

module.exports = PostStats;
