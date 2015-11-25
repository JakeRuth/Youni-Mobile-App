'use strict'

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var postStore = require('../../stores/PostStore');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var PostHeader = require('./PostHeader');
var PostLikeBar = require('./PostLikeBar');

var {
  View,
  Text,
  Image,
  PixelRatio,
  StyleSheet,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  postHeader: {
    flexDirection: 'row',
    margin: 10,
    marginTop: 0
  },
  posterName: {
    flex: 4,
    fontSize: 20
  },
  timestamp: {
    flex: 1,
    alignSelf: 'center',
    color: 'darkgray'
  },
  imageContainer: {
    flex: 1
  },
  postImage: {
    flex: 1,
    width: null,
    height: 300
  },
  postFooter: {
    flexDirection: 'column'
  },
  caption: {
    alignSelf: 'center',
    fontSize: 15,
    borderBottomWidth: 2,
    borderBottomColor: 'black'
  },
  blankLine: {
    borderWidth: 1 / PixelRatio.get(),
    borderColor: 'lightgray',
    margin: 10
  }
});

var Post = React.createClass({

  mixins: [
    Unicycle.listenTo(postStore)
  ],

  propTypes: {
    id: React.PropTypes.number.isRequired,
    //cannot be required because not all user's will have uploaded a profile pic
    posterProfileImageUrl: React.PropTypes.string,
    posterName: React.PropTypes.string.isRequired,
    timestamp: React.PropTypes.string.isRequired,
    photoUrl: React.PropTypes.string.isRequired,
    numLikes: React.PropTypes.number.isRequired,
    caption: React.PropTypes.string.isRequired,
    postIdString: React.PropTypes.string.isRequired,
    liked: React.PropTypes.bool.isRequired
  },

  render: function() {
    return (
      <View>

        <PostHeader
          posterName={this.props.posterName}
          posterProfileImageUrl={this.props.posterProfileImageUrl}
          timestamp={this.props.timestamp}/>

        <TouchableHighlight onPress={ this._photoOnClickAction(this.props.liked) }>
          <View style={styles.imageContainer}>
            <Image style={styles.postImage}
                   source={{uri: this.props.photoUrl}} />
          </View>
        </TouchableHighlight>

        <View style={styles.postFooter}>
          <PostLikeBar
            onStarPress={this._photoOnClickAction(this.props.liked)}
            liked={this.props.liked}
            numLikes={this.props.numLikes}
            postIdString={this.props.postIdString} />
          <Text style={styles.caption}>{this.props.caption == '_' ? '' : this.props.caption }</Text>{/*TODO: Fix this crap*/}
        </View>
        <View style={styles.blankLine} />

      </View>
    )
  },

  _photoOnClickAction: function(alreadyLiked) {
    if (!alreadyLiked) {
      return () => {
        var userId = userLoginMetadataStore.getUserId();
        Unicycle.exec('likePost', this.props.id, this.props.postIdString, userId);
      }
    }
    else {
      return () => {
        return; //do nothing
      }
    }
  }

});

module.exports = Post;
