'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var TrendingUser = require('./TrendingUser');
var ProfilePopup = require('../PopupPages/ProfilePopup');
var trendingStore = require('../../stores/trending/TrendingStore');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var {
  View,
  ScrollView,
  StyleSheet,
  PixelRatio,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({

});

var TrendingUsersList = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

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
      <ScrollView automaticallyAdjustContentInsets={false}>
        {trendingUsers}
      </ScrollView>
    );
  },

  _renderTrendingUserRow: function(trendingUser, index) {
    return (
      <TouchableHighlight
        key={index}
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
    var userEmail = userLoginMetadataStore.getEmail();

    // Don't let a user click themselves
    if (userEmail !== email) {
      this.props.navigator.push({
        component: ProfilePopup,
        passProps: {profileUserEmail: email}
      });
    }
  }

});

module.exports = TrendingUsersList;
