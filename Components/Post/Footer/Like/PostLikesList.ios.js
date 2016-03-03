'use strict';

var React = require('react-native');
var Unicycle = require('../../../../Unicycle');
var Spinner = require('../../../Common/Spinner');
var ProfilePopup = require('../../../PopupPages/ProfilePopup');
var userLoginMetadataStore = require('../../../../stores/UserLoginMetadataStore');

var {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  container: {
    paddingTop: 10
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
    fontSize: 20
  }
});

var PostLikesList = React.createClass({

  propTypes: {
    loading: React.PropTypes.bool.isRequired,
    users: React.PropTypes.array.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    var userRows = [],
        content;

    if (this.props.loading) {
      content = (
        <Spinner/>
      );
    }
    else {
      for (var i = 0; i < this.props.users.length; i++) {
        userRows.push(
            this._renderUser(this.props.users[i], i)
        );
      }
      content = userRows;
    }

    return (
      <View style={styles.container}>
        {content}
      </View>
    );
  },

  _renderUser: function(user, index) {
    return (
      <TouchableHighlight
        key={index}
        underlayColor={'transparent'}
        onPress={() => {this._onUserPress(user.email);}}>

        <View style={styles.userRow}>
          <Image
              style={styles.userImage}
              source={{uri: user.profileImageUrl}}/>
          <Text style={styles.displayName}>
            {user.firstName} {user.lastName}
          </Text>
        </View>

      </TouchableHighlight>
    );
  },

  _onUserPress: function(userEmail) {
    var email = userLoginMetadataStore.getEmail();

    // Don't let a user click on themselves
    if (email !== userEmail) {
      this.props.navigator.push({
        component: ProfilePopup,
        passProps: {profileUserEmail: userEmail}
      });
    }
  }

});

module.exports = PostLikesList;
