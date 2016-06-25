'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var ProfileImageThumbnail = require('./ProfileImageThumbnail');
var Colors = require('../../Utils/Common/Colors');

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
    paddingLeft: 20,
    paddingRight: 20,
    height: 55
  },
  profileImage: {
    alignSelf: 'center',
    height: 45,
    width: 45,
    borderRadius: 22
  },
  noProfilePictureIcon: {
    width: 45,
    alignItems: 'center',
    justifyContent: 'center'
  },
  fullName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '100',
    alignSelf: 'center',
    color: Colors.DARK_GRAY,
    paddingLeft: 16
  }
});

var UserListItem = React.createClass({

  propTypes: {
    user: React.PropTypes.object.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    var user = this.props.user,
        firstName = user.firstName,
        lastName = user.lastName,
        email = user.email,
        profileImageUrl = user.profileImageUrl,
        profilePicture;

    if (profileImageUrl) {
      profilePicture = (
        <ProfileImageThumbnail profileImageUrl={profileImageUrl}/>
      );
    }
    else {
      profilePicture = (
        <View style={styles.noProfilePictureIcon}>
          <Icon
            name='ios-person'
            size={40}
            color={Colors.YOUNI_PRIMARY_PURPLE} />
        </View>
      );
    }

    return (
      <View>
        <TouchableHighlight
          underlayColor='transparent'
          onPress={ () => {this._onUserListItemPress(email)} }>

          <View style={styles.container}>
            {profilePicture}
            <Text
              style={styles.fullName}
              numberOfLines={1}>
              {firstName} {lastName}
            </Text>
          </View>

        </TouchableHighlight>
      </View>
    );
  },

  _onUserListItemPress: function(email) {
    //required within this function to avoid circular dependencies
    var ProfilePopup = require('../PopupPages/ProfilePopup');

    this.props.navigator.push({
      component: ProfilePopup,
      passProps: {profileUserEmail: this.props.user.email}
    });
  }

});

module.exports = UserListItem;
