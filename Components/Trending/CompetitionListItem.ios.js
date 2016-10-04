'use strict';

var React = require('react');
var ReactNative = require('react-native');

var ProfileImageThumbnail = require('../Common/ProfileImageThumbnail');
var GroupPopup = require('../PopupPages/GroupPopup');

var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    height: 80,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10
  },
  rankingContainer: {
    height: 30,
    width: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  rankingText: {
    textAlign: 'center',
    fontSize: 18,
    color: Colors.DARK_GRAY
  },
  name: {
    flex: 1,
    fontSize: 18,
    marginLeft: 12,
    color: Colors.DARK_GRAY
  },
  separator: {
    height: 1,
    width: Dimensions.get('window').width * .8,
    backgroundColor: Colors.LIGHT_GRAY,
    marginLeft: Dimensions.get('window').width * .1
  }
});

var CompetitionListItem = React.createClass({

  propTypes: {
    group: React.PropTypes.object.isRequired,
    ranking: React.PropTypes.number.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    return (
      <View>
        <TouchableHighlight
          underlayColor="transparent"
          onPress={this._onPress}>
          <View style={styles.container}>

            {this._renderRanking(this.props.ranking)}

            <ProfileImageThumbnail profileImageUrl={this.props.group.badgeImageUrl}/>

            <Text
              style={styles.name}
              numberOfLines={1}>
              {this.props.group.name}
            </Text>

          </View>
        </TouchableHighlight>
        <View style={styles.separator}/>
      </View>
    );
  },

  _renderRanking: function(rank) {
    if (rank === 1) {
      return (
        <Image
          style={styles.rankingContainer}
          resizeMode="cover"
          source={require('../../images/firstPlace.png')}/>
      );
    }
    else if (rank === 2) {
      return (
          <Image
          style={styles.rankingContainer}
          resizeMode="cover"
          source={require('../../images/secondPlace.png')}/>
      );
    }
    else if (rank === 3) {
      return (
          <Image
          style={styles.rankingContainer}
          resizeMode="cover"
          source={require('../../images/thirdPlace.png')}/>
      );
    }
    else {
      return (
        <View style={styles.rankingContainer}>
          <Text style={styles.rankingText}>
            {this.props.ranking}
          </Text>
        </View>
      );
    }
  },

  _onPress: function() {
    this.props.navigator.push({
      component: GroupPopup,
      passProps: {...this.props}
    });
  }

});

module.exports = CompetitionListItem;
