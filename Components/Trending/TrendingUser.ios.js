'use strict';

var React = require('react-native');
var Emoji = require('../Common/Emoji');
var trendingStore = require('../../stores/trending/TrendingStore');

var {
  View,
  Text,
  Image,
  StyleSheet,
  PixelRatio
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    flexDirection: 'row',
    borderBottomWidth: .5,
    borderBottomColor: '#525252'
  },
  ranking: {
    alignSelf: 'center',
    fontSize: 15,
    marginRight: 5,
    color: '#525252'
  },
  name: {
    flex: 1,
    alignSelf: 'center',
    fontSize: 20,
    color: '#525252',
    marginLeft: 15,
    marginRight: 15
  },
  points: {
    alignSelf: 'center',
    right: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  pointsValue: {
    textAlign: 'right'
  },
  pointsFireEmoji: {
    marginBottom: 3
  },
  image: {
    justifyContent: 'center',
    width: PixelRatio.getPixelSizeForLayoutSize(30),
    height: PixelRatio.getPixelSizeForLayoutSize(30),
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: PixelRatio.getPixelSizeForLayoutSize(15),
    borderColor: '#525252'
  }
});

var TrendingUser = React.createClass({

  propTypes: {
    ranking: React.PropTypes.number.isRequired,
    firstName: React.PropTypes.string.isRequired,
    profileImageUrl: React.PropTypes.string,
    points: React.PropTypes.number.isRequired
  },

  render: function() {
    return (
      <View style={styles.container}>

        <Text style={styles.ranking}>
          #{this.props.ranking}
        </Text>

        <Image
          style={styles.image}
          source={{uri: this.props.profileImageUrl}}/>

        <Text
          style={styles.name}
          numberOfLines={1}>
          {this.props.firstName}
        </Text>

        <View style={styles.points}>
          <Text stlye={styles.pointsValue}>
            {this.props.points}
          </Text>
          <Emoji
            style={styles.pointsFireEmoji}
            name="fire"
            size={12}/>
        </View>

      </View>
    );
  }

});

module.exports = TrendingUser;
