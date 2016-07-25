'use strict';

var React = require('react-native');
var ProfileImageThumbnail = require('./ProfileImageThumbnail');
var Colors = require('../../Utils/Common/Colors');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 55
  },
  fullName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '100',
    alignSelf: 'center',
    color: Colors.DARK_GRAY,
    paddingLeft: 20
  }
});

var UserListItem = React.createClass({

  propTypes: {
    user: React.PropTypes.object.isRequired,
    displayNameOverride: React.PropTypes.string,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    var user = this.props.user,
        email = user.email;

    return (
      <View style={this.props.style}>
        <TouchableHighlight
          underlayColor='transparent'
          onPress={ () => {this._onUserListItemPress(email)} }>

          <View style={styles.container}>
            <ProfileImageThumbnail profileImageUrl={user.profileImageUrl}/>
            <Text
              style={styles.fullName}
              numberOfLines={1}>
              {this._getDisplayName(user)}
            </Text>
          </View>

        </TouchableHighlight>
      </View>
    );
  },

  _onUserListItemPress: function(email) {
    if (userLoginMetadataStore.getEmail() === email) {
      return; // you shouldn't be allowed to click on your own profile
    }

    //required within this function to avoid circular dependencies
    var ProfilePopup = require('../PopupPages/ProfilePopup');

    this.props.navigator.push({
      component: ProfilePopup,
      passProps: {profileUserEmail: this.props.user.email}
    });
  },
  
  _getDisplayName: function(user) {
    if (this.props.displayNameOverride) {
      return this.props.displayNameOverride;
    }
    else {
      return user.firstName + ' ' + user.lastName;
    }
  }

});

module.exports = UserListItem;
