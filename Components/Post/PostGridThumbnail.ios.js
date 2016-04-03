'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var Icon = require('react-native-vector-icons/Ionicons');
var PostPopup = require('../PopupPages/PostPopup');
var Emoji = require('../Common/Emoji');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

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
    paddingRight: 2,
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
  fireIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    opacity: .75
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
    var fireIcon;

    if (this.props.post.isPostUserCurrentlyTrending) {
      fireIcon = (
        <View style={styles.fireIcon}>
          <Emoji
            name="fire"
            size={25}/>
        </View>
      );
    }

    return (
      <TouchableHighlight
        style={styles.container}
        underlayColor='transparent'
        onPress={this._onPostClick}>

        <View>
          <Image
            style={styles.image}
            source={{uri: this.props.post.photoUrl}}>

            <Image
              style={styles.posterProfileImage}
              source={{uri: this.props.post.posterProfileImageUrl}}/>

          </Image>
          {this._renderPostStats()}
          {fireIcon}
        </View>

      </TouchableHighlight>
    );
  },

  // TODO: Clean this up, rushed it for a release
  _renderPostStats: function() {
    var viewsStat, likesStat, commentsStat;

    // Need to check this since post views were introduced and recorded after likes existed
    if (this.props.post.numViews >= this.props.post.numLikes) {
      viewsStat = (
        <View style={[styles.iconContainer, styles.leftMostIcon]}>
          <Text style={styles.iconLabel}>
            {this.props.post.numViews === 0 ? 1 : this.props.post.numViews}
          </Text>
          <Icon
            style={styles.icon}
            name={'eye'}
            size={this._iconSize}
            color="white"/>
        </View>
      );
    }

    if (this.props.post.numLikes) {
      let likeCountStyles = [styles.iconContainer];

      if (!this.props.post.numViews || this.props.post.numViews < this.props.post.numLikes) {
        likeCountStyles.push(styles.leftMostIcon);
      }

      likesStat = (
        <View style={likeCountStyles}>
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

      if (this.props.post.numViews !== 0 && this.props.post.numViews < this.props.post.numLikes && !this.props.post.numLikes) {
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

        {viewsStat}
        {likesStat}
        {commentsStat}

      </View>
    );
  },

  _onPostClick: function() {
    var email = userLoginMetadataStore.getEmail();

    this.props.navigator.push({
      component: PostPopup,
      passProps: {post: this.props.post}
    });

    if (email !== this.props.post.posterEmail) {
      Unicycle.exec('triggerPostView', email, this.props.post.postIdString, this.props.post.id);
    }
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
