'use strict';

var React = require('react-native');
var trendingStore = require('../../stores/trending/TrendingStore');

var {
  View,
  Text,
  Image,
  StyleSheet,
  PixelRatio
} = React

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
    right: 5
  },
  image: {
    justifyContent: 'center',
    width: PixelRatio.getPixelSizeForLayoutSize(30),
    height: PixelRatio.getPixelSizeForLayoutSize(30),
    borderWidth: .5,
    borderRadius: PixelRatio.getPixelSizeForLayoutSize(15),
    borderColor: '#525252'
  }
});

var TrendingUser = React.createClass({

  propTypes: {
    ranking: React.PropTypes.number.isRequired,
    firstName: React.PropTypes.string.isRequired,
    profileImageUrl: React.PropTypes.string.isRequired,
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

        <Text style={styles.points}>
          {this.props.points}
        </Text>

      </View>
    );
  }

});

module.exports = TrendingUser;
