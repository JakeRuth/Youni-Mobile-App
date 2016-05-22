'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var ProfilePopup = require('../PopupPages/ProfilePopup');
var Color = require('../../Utils/Common/GlobalColorMap');

var {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  searchResult: {
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

var SearchResult = React.createClass({

  propTypes: {
    search: React.PropTypes.object.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    var search = this.props.search,
        firstName = search.firstName,
        lastName = search.lastName,
        email = search.email,
        profileImageUrl = search.profileImageUrl,
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
          underlayColor='lightgray'
          onPress={ () => {this._onSearchResultClick(email)} }>

          <View style={styles.searchResult}>
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

  _onSearchResultClick: function(email) {
    this.props.navigator.push({
      component: ProfilePopup,
      passProps: {profileUserEmail: this.props.search.email}
    });
  }

});

module.exports = SearchResult;
