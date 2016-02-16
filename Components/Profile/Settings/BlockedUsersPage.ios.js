'use strict';

var React = require('react-native');
var Unicycle = require('../../../Unicycle');
var userLoginMetadataStore = require('../../../stores/UserLoginMetadataStore');
var Spinner = require('../../Common/Spinner');

var {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 15
  },
  likerListScroll: {
    margin: 20,
    padding: 20
  },
  blockedUserContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  blockedUserFullName: {
    fontSize: 15
  },
  removeBlockButton: {
    marginRight: 15,
    fontSize: 15,
    color: '#FF7878',
    padding: 5,
    margin: 3,
    borderWidth: 1,
    borderColor: '#FF7878'
  }
});

var BlockedUsersPage = React.createClass({

  propTypes: {
    loading: React.PropTypes.bool.isRequired,
    users: React.PropTypes.object.isRequired
  },

  render: function() {
    var content;

    if (this.props.loading) {
      content = (
        <Spinner/>
      );
    }
    else if (this.props.users.size != 0) {
      content = this._renderBlockedUsersList(this.props.users);
    }
    else {
      content = this._renderNoBlockedUsersMessage();
    }

    return (
      <View style={styles.container}>
        {content}
      </View>
    );
  },

  _renderBlockedUsersList: function(blockedUsers) {
    var userListItems = [];

    for (var i = 0; i < blockedUsers.size; i++) {
      userListItems.push(this._renderBlockedUser(blockedUsers.get(i)));
    }

    return (
      <View>
        {userListItems}
      </View>
    );
  },

  _renderBlockedUser: function(user) {
    return (
      <View style={styles.blockedUserContainer}>

        <TouchableHighlight
          underlayColor='transparent'
          onPress={() => {
            this._onUnBlockButtonPress(user);
          }}>

          <Text style={styles.removeBlockButton}>
            Remove block
          </Text>

        </TouchableHighlight>

        <Text style={styles.blockedUserFullName}>
          {user.get('firstName')} {user.get('lastName')}
        </Text>

      </View>
    );
  },

  _renderNoBlockedUsersMessage: function() {
    return (
      <Text>You have not blocked anyone</Text>
    );
  },

  _onUnBlockButtonPress: function(user) {
    var loggedInUserId = userLoginMetadataStore.getUserId();
    // user 'id' here is just the index of the user in the list.
    Unicycle.exec('removeBlock', user.get('id'), loggedInUserId, user.get('email'));
  }

});

module.exports = BlockedUsersPage;
