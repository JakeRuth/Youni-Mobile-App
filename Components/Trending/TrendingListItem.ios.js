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
  rankingContainer: {
    height: 30,
    width: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  firstRankingContainer: {
    backgroundColor: '#FBD964',
    color: 'white'
  },
  secondRankingContainer: {
    backgroundColor: '#C6C6C6',
    color: 'white'
  },
  thirdRankingContainer: {
    backgroundColor: '#E36C2D',
    color: 'white'
  },
  ranking: {
    textAlign: 'center',
    fontSize: 20,
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
    fontSize: 16,
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

          {this._renderRanking(this.props.ranking)}

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
  },

  _renderRanking: function(rank) {
    if (rank === 1) {
      return (
        <View style={[styles.rankingContainer, styles.firstRankingContainer]}>
          <Text style={[styles.ranking, { color: 'white' }]}>
            {this.props.ranking}
          </Text>
        </View>
      );
    }
    else if (rank === 2) {
      return (
        <View style={[styles.rankingContainer, styles.secondRankingContainer]}>
          <Text style={[styles.ranking, { color: 'white' }]}>
            {this.props.ranking}
          </Text>
        </View>
      );
    }
    else if (rank === 3) {
      return (
        <View style={[styles.rankingContainer, styles.thirdRankingContainer]}>
          <Text style={[styles.ranking, { color: 'white' }]}>
            {this.props.ranking}
          </Text>
        </View>
      );
    }
    else {
      return (
        <View style={styles.rankingContainer}>
          <Text style={styles.ranking}>
            {this.props.ranking}
          </Text>
        </View>
      );
    }
  }

});

module.exports = TrendingListItem;
