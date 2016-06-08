'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Color = require('../../Utils/Common/Colors');

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
    marginLeft: 10,
    marginRight: 10
  },
  profileImage: {
    alignSelf: 'center',
    height: 45,
    width: 45,
    borderRadius: 22,
    marginRight: 10
  },
  noProfilePictureIcon: {
    paddingLeft: 10
  },
  fullName: {
    flex: 1,
    fontSize: 20,
    alignSelf: 'center'
  },
  blankLine: {
    borderWidth: .3,
    borderColor: '#ADADAD',
    margin: 5
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
        <Image
          style={styles.profileImage}
          source={{uri: profileImageUrl}}/>
      );
    }
    else {
      profilePicture = (
        <Icon
          style={[styles.profileImage, styles.noProfilePictureIcon]}
          name='ios-person'
          size={40}
          color={Color.YOUNI_PRIMARY_PURPLE} />
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
        <View style={styles.blankLine}/>
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
