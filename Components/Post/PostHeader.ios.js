'use strict'

var React = require('react-native');

var {
  View,
  Text,
  Image,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    marginTop: 0
  },
  posterImage: {
    height: 45,
    width: 45,
    borderRadius: 22,
    marginRight: 10
  },
  posterName: {
    flex: 4,
    fontSize: 20
  },
  timestamp: {
    flex: 1,
    alignSelf: 'center',
    color: 'darkgray'
  }
});

var PostHeader = React.createClass({

  propTypes: {
    posterProfileImageUrl: React.PropTypes.string,
    posterName: React.PropTypes.string.isRequired,
    timestamp: React.PropTypes.string.isRequired
  },

  render: function() {
    var posterProfilePicture = <View/>

    if (this.props.posterProfileImageUrl) {
      posterProfilePicture = (
        <Image style={styles.posterImage} source={{uri: this.props.posterProfileImageUrl}} />
      );
    }

    return (
      <View style={styles.postHeader}>
        {posterProfilePicture}
        <Text style={styles.posterName} numberOfLines={1}>{this.props.posterName}</Text>
        <Text style={styles.timestamp}>{this.props.timestamp}</Text>
      </View>
    )
  }

});

module.exports = PostHeader;
