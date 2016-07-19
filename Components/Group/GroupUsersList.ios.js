'use strict';

var React = require('react-native');

var ManageGroupUserListItem = require('../Group/Admin/ManageGroupUserListItem');
var UserListItem = require('../Common/UserListItem');
var LoadMoreButton = require('../Common/LoadMoreButton');
var Spinner = require('../Common/Spinner');

var {
  View,
  Text,
  StyleSheet,
  ScrollView
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  spinnerContainer: {
    paddingTop: 10
  }
});

var GroupUsersList = React.createClass({

  propTypes: {
    isLoading: React.PropTypes.bool.isRequired,
    moreToFetch: React.PropTypes.bool.isRequired,
    onLoadMorePress: React.PropTypes.func.isRequired,
    users: React.PropTypes.array.isRequired,
    group: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired,
      description: React.PropTypes.string.isRequired,
      coverImageUrl: React.PropTypes.string.isRequired,
      badgeImageUrl: React.PropTypes.string.isRequired,
      adminEmails: React.PropTypes.array,
      allTimeTrendPoints: React.PropTypes.number.isRequired,
      numPosts: React.PropTypes.number.isRequired,
      numMembers: React.PropTypes.number.isRequired
    }).isRequired,
    manageUsers: React.PropTypes.bool,
    navigator: React.PropTypes.object.isRequired
  },

  render: function () {
    var users = this.props.users,
        userResults = [];

    for (var i = 0; i < users.length; i++) {
      if (this.props.manageUsers) {
        userResults.push(
          <ManageGroupUserListItem
            user={users[i]}
            group={this.props.group}
            displayNameOverride={this._getUserDisplayName(users[i])}
            key={i}/>
        );
      }
      else {
        userResults.push(
          <UserListItem
            key={i}
            user={users[i]}
            displayNameOverride={this._getUserDisplayName(users[i])}
            navigator={this.props.navigator}/>
        );
      }
    }

    return (
      <ScrollView
        style={styles.container}
        automaticallyAdjustContentInsets={false}>

        {userResults}
        <LoadMoreButton
          onPress={this.props.onLoadMorePress}
          isLoading={this.props.isLoading}
          isVisible={this.props.moreToFetch}/>
        
      </ScrollView>
    );
  },

  _getUserDisplayName: function(user) {
    var baseName = user.firstName + ' ' + user.lastName;

    if (user.isGroupAdmin) {
      return baseName + ' (admin)';
    }
    else {
      return baseName;
    }
  }

});

module.exports = GroupUsersList;
