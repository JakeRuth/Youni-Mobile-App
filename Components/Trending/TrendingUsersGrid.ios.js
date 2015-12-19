'use strict';

var React = require('react-native');
var TrendingUser = require('./TrendingUser');
var trendingStore = require('../../stores/trending/TrendingStore');

var {
  View,
  ListView,
  StyleSheet,
  PixelRatio,
  TouchableHighlight
} = React

var styles = StyleSheet.create({
  trendingUserSquareContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 50
  },
  trendingUserFirstName: {
    textAlign: 'center',
    width: PixelRatio.getPixelSizeForLayoutSize(75)
  },
  trendingUserLink: {
    flex: 1,
    fontWeight: 'bold'
  }
});

//Reference for what I looked at to make this ListView:
//https://github.com/yelled3/react-native-grid-example/blob/master/GridLayoutExample/index.ios.js
var TrendingUsersGrid = React.createClass({

  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows(this._generateTrendingUserLinks())
    };
  },

  render: function() {
    return (
      <ListView
        contentContainerStyle={styles.trendingUserSquareContainer}
        dataSource={this.state.dataSource}
        renderRow={this._renderTrendingUserRow} />
    );
  },

  _renderTrendingUserRow: function(trendingUser) {
    return (
      <TouchableHighlight underlayColor='transparent'>
        <View>
          <TrendingUser
            firstName={trendingUser.firstName}
            lastName={trendingUser.lastName}
            bio={trendingUser.bio}
            numFans={trendingUser.numFans}
            profileImageUrl={trendingUser.profileImageUrl}
            email={trendingUser.email}
            id={trendingUser.id} />
        </View>
      </TouchableHighlight>
    );
  },

  _generateTrendingUserLinks: function() {
    var trendingUsers = trendingStore.getTrendingUsers(),
        users = [];
    for (var i = 0; i < trendingUsers.size; i++) {
      users.push(trendingUsers.get(i));
    }
    return users;
  },

});

module.exports = TrendingUsersGrid;
