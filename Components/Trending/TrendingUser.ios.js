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
  trendingUserFirstName: {
    textAlign: 'center',
    width: PixelRatio.getPixelSizeForLayoutSize(75)
  },
  row: {
    flex: 1,
    justifyContent: 'center',
    margin: 2,
    width: PixelRatio.getPixelSizeForLayoutSize(75),
    height: PixelRatio.getPixelSizeForLayoutSize(75),
    backgroundColor: '#F6F6F6',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: PixelRatio.getPixelSizeForLayoutSize(37),
    borderColor: '#CCC'
  }
});

var TrendingUser = React.createClass({

  propTypes: {
    firstName: React.PropTypes.string.isRequired,
    lastName: React.PropTypes.string.isRequired,
    bio: React.PropTypes.string,
    numFans: React.PropTypes.number.isRequired,
    profileImageUrl: React.PropTypes.string.isRequired,
    email: React.PropTypes.string.isRequired,
    id: React.PropTypes.number.isRequired
  },

  render: function() {
    return (
      <View >
        <Text style={styles.trendingUserFirstName}>{this.props.firstName}</Text>
        <Image style={styles.row}
               source={{uri: this.props.profileImageUrl}} />
      </View>
    );
  }

});

module.exports = TrendingUser;
