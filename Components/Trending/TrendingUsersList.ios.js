'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var TrendingUser = require('./TrendingUser');
var trendingStore = require('../../stores/trending/TrendingStore');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var {
  View,
  ScrollView,
  StyleSheet,
  PixelRatio,
  TouchableHighlight
} = React

var styles = StyleSheet.create({
  container: {
    marginBottom: 50
  }
});

var TrendingUsersList = React.createClass({

  render: function() {
    var trendingUsers = [],
        trendingUsersJson = trendingStore.getTrendingUsers();

    for (var i = 0; i<trendingUsersJson.size; i++) {
      var user = trendingUsersJson.get(i);
      trendingUsers.push(
        this._renderTrendingUserRow(user, i)
      );
    }

    return (
      <ScrollView style={styles.container}>
        {trendingUsers}
      </ScrollView>
    );
  },

  _renderTrendingUserRow: function(trendingUser, index) {
    return (
      <TouchableHighlight
        underlayColor='transparent'
        onPress={() => {
          this.onTrendingUserPress(trendingUser.email);
        }}>

        <View>
          <TrendingUser
            ranking={index + 1}
            firstName={trendingUser.firstName}
            profileImageUrl={trendingUser.profileImageUrl}
            points={trendingUser.currentPoints}/>
        </View>

      </TouchableHighlight>
    );
  },

  onTrendingUserPress: function(email) {
    var userId = userLoginMetadataStore.getUserId();

    Unicycle.exec('reInitializeUsersProfileFeedOffset');
    Unicycle.exec('loadUsersProfile', email);
    Unicycle.exec('getUserPosts', email, userId);
    Unicycle.exec('setProfileModalVisibile', true);
  }

});

module.exports = TrendingUsersList;
