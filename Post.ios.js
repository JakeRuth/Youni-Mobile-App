'use strict'

var React = require('react-native');
var Unicycle = require('./Unicycle');
var postStore = require('./stores/PostStore');
var userLoginMetadataStore = require('./stores/UserLoginMetadataStore');
var LikeText = require('./Components/Post/PostLikeText');

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
    posterName: React.PropTypes.string.isRequired,
    timestamp: React.PropTypes.string.isRequired,
    photoUrl: React.PropTypes.string.isRequired,
    numLikes: React.PropTypes.number.isRequired,
    caption: React.PropTypes.string.isRequired,
    postIdString: React.PropTypes.string.isRequired
  },

  render: function() {
    return (
      <View>
        <View style={styles.postHeader}>
          <Text style={styles.posterName} numberOfLines={1}>{this.props.posterName}</Text>
          <Text style={styles.timestamp}>{this.props.timestamp}</Text>
        </View>
        <TouchableHighlight onPress={ this._photoOnClickAction() }>
          <View style={styles.imageContainer}>
            <Image style={styles.postImage}
                   source={{uri: this.props.photoUrl}} />
          </View>
        </TouchableHighlight>
        <View style={styles.postFooter}>
          <LikeText numLikes={this.props.numLikes} />
          <Text style={styles.caption}>{this.props.caption}</Text>
        </View>
        <View style={styles.blankLine} />
      </View>
    )
  },

  _photoOnClickAction: function() {
    return () => {
      var userId = userLoginMetadataStore.getUserId();
      Unicycle.exec('likePost', this.props.id, this.props.postIdString, userId);
    }
  }

});

module.exports = Post;
