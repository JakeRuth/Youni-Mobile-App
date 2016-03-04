'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var PostPopup = require('../PopupPages/PostPopup');

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
    height: 200
  },
  posterProfileImage: {
    top: 2,
    left: 2,
    height: 30,
    width: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'lightgray'
  },
  postStats: {
    marginTop: -20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  iconContainer: {
    paddingRight: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 20,
    backgroundColor: 'rgba(0, 0, 0, .5)'
  },
  leftMostIcon: {
    borderTopLeftRadius: 15,
    paddingLeft: 2
  },
  iconLabel: {
    alignSelf: 'center',
    color: 'white',
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

  _renderPostStats: function() {
    var likesStat = <View/>,
        commentsStat = <View/>;

    if (this.props.post.numLikes) {
      likesStat = (
          <View style={[styles.iconContainer, styles.leftMostIcon]}>
            <Text style={styles.iconLabel}>
              {this.props.post.numLikes}
            </Text>
            <Icon
                style={styles.icon}
                name={this._getStarIconName()}
                size={20}
                color={'#FCDD00'}/>
          </View>
      );
    }
    if (this.props.post.numComments) {
      var commentsCountStyles = [styles.iconContainer];

      if (!this.props.post.numLikes) {
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
                size={20}
                color={'#00D8F0'}/>
          </View>
      );
    }

    return (
      <View style={styles.postStats}>

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
  }

});

module.exports = PostGridThumbnail;
