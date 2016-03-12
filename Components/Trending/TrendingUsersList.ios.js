'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var TrendingUser = require('./TrendingUser');
var ProfilePopup = require('../PopupPages/ProfilePopup');
var ScrollViewRefresh = require('../Common/ScrollViewRefresh');
var trendingStore = require('../../stores/trending/TrendingStore');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var {
  View,
  ScrollView,
  RefreshControl,
  TouchableHighlight
} = React;

var TrendingUsersList = React.createClass({

  propTypes: {
    onPageRefresh: React.PropTypes.func.isRequired,
    isPageRefreshing: React.PropTypes.bool.isRequired,
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
      <ScrollView
        automaticallyAdjustContentInsets={false}
        onScroll={this._handleScroll}>
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
          this._onTrendingUserPress(trendingUser.email);
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

  _onTrendingUserPress: function(email) {
    var userEmail = userLoginMetadataStore.getEmail();

    // Don't let a user click themselves
    if (userEmail !== email) {
      this.props.navigator.push({
        component: ProfilePopup,
        passProps: {profileUserEmail: email}
      });
    }
  },

  _handleScroll: function(e) {
    var infiniteScrollThreshold = -1;

    if (e.nativeEvent.contentOffset.y < infiniteScrollThreshold) {
      this.props.onPageRefresh();
    }
  }

});

module.exports = TrendingUsersList;
