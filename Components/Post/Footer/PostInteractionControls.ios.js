'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var PostLikesPopup = require('../../PopupPages/PostLikesPopup');
var Colors = require('../../../Utils/Common/Colors');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} = ReactNative;

var ICON_SIZE = 40;

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8
  },
  icon: {
    marginTop: 3,
    marginRight: 20
  },
  iconLabel: {
    alignSelf: 'center',
    color: Colors.DARK_GRAY,
    fontSize: 20,
    fontWeight: '200',
    paddingLeft: 8,
    paddingRight: 12.5
  }
});

var PostInteractionControls = React.createClass({

  propTypes: {
    onStarPress: React.PropTypes.func,
    onCommentPress: React.PropTypes.func,
    post: React.PropTypes.object.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    return (
      <View style={[styles.container, this.props.style]}>
        <TouchableHighlight
          onPress={this.props.onStarPress}
          underlayColor='transparent'>
          <Icon
            style={styles.icon}
            color="red"
            name={this._getStarIconName()}
            size={ICON_SIZE}/>
        </TouchableHighlight>

        <TouchableHighlight
          onPress={this.props.onCommentPress}
          underlayColor='transparent'>
          <Icon
            style={styles.icon}
            name='ios-chatbubble-outline'
            size={ICON_SIZE}
            color={Colors.MED_GRAY}/>
        </TouchableHighlight>
      </View>
    );
  },

  _onPress: function() {
    this.props.navigator.push({
      component: PostLikesPopup,
      passProps: {
        postId: this.props.post.postIdString
      }
    })
  },

  _getStarIconName: function() {
    if (this.props.post.liked) {
      return 'ios-heart';
    }
    else {
      return 'ios-heart-outline';
    }
  }

});

module.exports = PostInteractionControls;
