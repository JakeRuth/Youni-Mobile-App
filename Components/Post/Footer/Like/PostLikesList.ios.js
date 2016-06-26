'use strict';

var React = require('react-native');
var Unicycle = require('../../../../Unicycle');
var LoadMoreButton = require('../../../Common/LoadMoreButton');
var UserListItem = require('../../../Common/UserListItem');
var ProfilePopup = require('../../../PopupPages/ProfilePopup');
var userLoginMetadataStore = require('../../../../stores/UserLoginMetadataStore');

var {
  View,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  container: {
    paddingLeft: 15,
    paddingRight: 15
  },
  userRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 5
  },
  userImage: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 10
  },
  displayName: {
    flex: 1,
    fontSize: 20
  }
});

var PostLikesList = React.createClass({

  propTypes: {
    users: React.PropTypes.array.isRequired,
    isLoadingMoreUsers: React.PropTypes.bool.isRequired,
    moreToFetch: React.PropTypes.bool.isRequired,
    onLoadMorePress: React.PropTypes.func.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    var usersListItems = [];

    for (var i = 0; i < this.props.users.length; i++) {
      usersListItems.push(
          this._renderUser(this.props.users[i], i)
      );
    }

    return (
      <View style={styles.container}>
        {usersListItems}
        <LoadMoreButton
          onPress={this.props.onLoadMorePress}
          isLoading={this.props.isLoadingMoreUsers}
          isVisible={this.props.moreToFetch}/>
      </View>
    );
  },

  _renderUser: function(user, index) {
    return (
      <UserListItem
        key={index}
        user={user}
        navigator={this.props.navigator}/>
    );
  }

});

module.exports = PostLikesList;
