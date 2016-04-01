'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var PostPopup = require('../PopupPages/PostPopup');
var Emoji = require('../Common/Emoji');

var {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 1
  },
  image: {
    flex: 1,
    alignSelf: 'stretch',
    height: 133.33
  },
  posterProfileImage: {
    top: 2,
    left: 2,
    height: 27,
    width: 27,
    borderRadius: 13.5,
    borderWidth: 1,
    borderColor: 'lightgray'
  },
  postStats: {
    marginTop: -16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  iconContainer: {
    paddingRight: 4,
    paddingTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 16,
    backgroundColor: 'rgba(0, 0, 0, .5)'
  },
  leftMostIcon: {
    borderTopLeftRadius: 15,
    paddingLeft: 2
  },
  iconLabel: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 13,
    paddingLeft: 8,
    paddingRight: 4
  }
});

var PostGridThumbnail = React.createClass({

  propTypes: {
    post: React.PropTypes.object.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    return (
      <TouchableHighlight
          style={styles.container}
          underlayColor='transparent'
          onPress={() => {
            this.props.navigator.push({
              component: PostPopup,
              passProps: {post: this.props.post}
            })
          }}>

        <View>
          <Image
            style={styles.image}
            source={{uri: this.props.post.photoUrl}}>

            <Image
              style={styles.posterProfileImage}
              source={{uri: this.props.post.posterProfileImageUrl}}/>

          </Image>
          {this._renderPostStats()}
        </View>

      </TouchableHighlight>
    );
  },

  // TODO: Clean this up, rushed it for a release
  _renderPostStats: function() {
    var likesStat, commentsStat, fireEmoji;

    if (this.props.post.isPostUserCurrentlyTrending) {
      fireEmoji = (
        <View style={[styles.iconContainer, styles.leftMostIcon]}>
          <Emoji
            name="fire"
            size={this._iconSize}/>
        </View>
      );
    }

    if (this.props.post.numLikes) {
      let commentsCountStyles = [styles.iconContainer];

      if (!this.props.post.isPostUserCurrentlyTrending) {
        commentsCountStyles.push(styles.leftMostIcon);
      }

      likesStat = (
          <View style={commentsCountStyles}>
            <Text style={styles.iconLabel}>
              {this.props.post.numLikes}
            </Text>
            <Icon
                style={styles.icon}
                name={this._getStarIconName()}
                size={this._iconSize}
                color={'#FCDD00'}/>
          </View>
      );
    }

    if (this.props.post.numComments) {
      let commentsCountStyles = [styles.iconContainer];

      if (!this.props.post.numLikes && !this.props.post.isPostUserCurrentlyTrending) {
        commentsCountStyles.push(styles.leftMostIcon);
      }

      commentsStat = (
          <View style={commentsCountStyles}>
            <Text style={styles.iconLabel}>
              {this.props.post.numComments}
            </Text>
            <Icon
                style={styles.icon}
                name={'ios-chatbubble-outline'}
                size={this._iconSize}
                color={'#00D8F0'}/>
          </View>
      );
    }

    return (
      <View style={styles.postStats}>

        {fireEmoji}
        {likesStat}
        {commentsStat}

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
  },

  _iconSize: 17

});

module.exports = PostGridThumbnail;
