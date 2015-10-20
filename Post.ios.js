'use strict'

var React = require('react-native');
var Unicycle = require('./Unicycle');
var postStore = require('./stores/PostStore');

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
  numLikes: {
    alignSelf: 'center',
    color: 'darkblue',
    fontSize: 10,
    fontWeight: '600',
    margin: 3
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
    posterName: React.PropTypes.string.isRequired,
    timestamp: React.PropTypes.string.isRequired,
    photoUrl: React.PropTypes.string.isRequired,
    numLikes: React.PropTypes.number.isRequired,
    caption: React.PropTypes.string.isRequired,
    postIdString: React.PropTypes.number.isRequired //this will change with api integration
  },

  render: function() {
    return (
      <View>
        <View style={styles.postHeader}>
          <Text style={styles.posterName} numberOfLines={1}>{this.props.posterName}</Text>
          <Text style={styles.timestamp}>{this.props.timestamp}</Text>
        </View>
        <TouchableHighlight onPress={ () => {Unicycle.exec('likePost', this.props.postIdString)} }>
          <View style={styles.imageContainer}>
            <Image style={styles.postImage}
                   source={{uri: this.props.photoUrl}} />
          </View>
        </TouchableHighlight>
        <View style={styles.postFooter}>
          <Text style={styles.numLikes}>{this._getLikesText(this.props.numLikes)}</Text>
          <Text style={styles.caption}>{this.props.caption}</Text>
        </View>
        <View style={styles.blankLine} />
      </View>
    )
  },

  _getLikesText(numLikes) {
    if (numLikes > 1) {
      return numLikes + ' likes';
    }
    else if (numLikes === 1) {
      return numLikes + ' like';
    }
    else {
      return 'no likes... yet';
    }
  }

});

module.exports = Post;
