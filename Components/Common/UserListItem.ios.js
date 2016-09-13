'use strict';

var React = require('react');
var ReactNative = require('react-native');

var ProfileImageThumbnail = require('./ProfileImageThumbnail');
var ToggleFollowButton = require('./ToggleFollowButton');

var Colors = require('../../Utils/Common/Colors');
var IosStatusBarStyles = require('../../Utils/Common/IosStatusBarStyles');
var statusBarStyleStore = require('../../stores/StatusBarStyleStore');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10
  },
  fullName: {
    flex: 1,
    fontSize: 16,
    alignSelf: 'center',
    color: Colors.DARK_GRAY,
    paddingLeft: 20
  }
});

var UserListItem = React.createClass({

  propTypes: {
    user: React.PropTypes.object.isRequired,
    showToggleFollowButton: React.PropTypes.bool,
    displayNameOverride: React.PropTypes.string,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    var user = this.props.user,
        email = user.email,
        toggleFollowButton;

    if (this.props.showToggleFollowButton) {
      toggleFollowButton = <ToggleFollowButton user={this.props.user}/>;
    }

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
            {toggleFollowButton}
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
      passProps: {
        profileUserEmail: this.props.user.email,
        onBackArrowPress: () => statusBarStyleStore.setStyle(IosStatusBarStyles.LIGHT_CONTENT)
      }
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
