'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var TrendingUser = require('./TrendingUser');
var ProfilePopup = require('../PopupPages/ProfilePopup');
var Spinner = require('../Common/Spinner');
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
    isPageLoading: React.PropTypes.bool.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    var content,
        trendingUsersJson = trendingStore.getTrendingUsers();

    if (trendingUsersJson.size) {
      content = this._renderTrendingUsers(trendingUsersJson);
    }
    else if (this.props.isPageLoading) {
      content = <Spinner/>;
    }

    return (
      <ScrollView
        automaticallyAdjustContentInsets={false}
        onScroll={this._handleScroll}>
        {content}
      </ScrollView>
    );
  },

  _renderTrendingUsers: function(trendingUsersJson) {
    var trendingUsers = [];

    for (var i = 0; i<trendingUsersJson.size; i++) {
      var user = trendingUsersJson.get(i);
      trendingUsers.push(
        this._renderTrendingUserRow(user, i)
      );
    }

    return trendingUsers;
  },

  _renderTrendingUserRow: function(trendingUser, index) {
    var trendingUserStyles = [];

    // on initial page load there trending users json will be empty so this won't be hit and a spinner will be on the
    // page.  But here we want to just dim the results when another request is in flight, after initial page load.
    if (this.props.isPageLoading) {
      trendingUserStyles.push({opacity:.5});
    }

    return (
      <TouchableHighlight
        style={trendingUserStyles}
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
