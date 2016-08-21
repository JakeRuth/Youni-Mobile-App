'use strict';

var React = require('react');
var ReactNative = require('react-native');

var ProfileImageThumbnail = require('../Common/ProfileImageThumbnail');

var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LIGHT_GRAY
  },
  ranking: {
    width: 40,
    textAlign: 'center',
    fontSize: 16,
    marginRight: 5,
    color: Colors.DARK_GRAY
  },
  nameAndScoreContainer: {
    flex: 1
  },
  name: {
    flex: 1,
    fontSize: 18,
    marginLeft: 12,
    color: Colors.DARK_GRAY
  },
  score: {
    fontSize: 14,
    marginLeft: 12,
    color: Colors.MED_GRAY
  }
});

var TrendingListItem = React.createClass({

  propTypes: {
    name: React.PropTypes.string.isRequired,
    score: React.PropTypes.string.isRequired,
    imageUrl: React.PropTypes.string,
    ranking: React.PropTypes.number.isRequired,
    onPress: React.PropTypes.func.isRequired
  },

  render: function() {
    return (
      <TouchableHighlight
        underlayColor="transparent"
        onPress={this.props.onPress}>
        <View style={styles.container}>

          <Text style={styles.ranking}>
            {this.props.ranking}
          </Text>

          <ProfileImageThumbnail profileImageUrl={this.props.imageUrl}/>

          <View style={styles.nameAndScoreContainer}>
            <Text
              style={styles.name}
              numberOfLines={1}>
              {this.props.name}
            </Text>
            <Text style={styles.score}>
              {this.props.score} pts
            </Text>
          </View>

        </View>
      </TouchableHighlight>
    );
  }

});

module.exports = TrendingListItem;
