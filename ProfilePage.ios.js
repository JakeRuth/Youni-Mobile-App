'use strict';

var React = require('react-native');
var Unicycle = require('./Unicycle');
var profileStore = require('./stores/ProfileStore');
var MainScreenBanner = require('./MainScreenBanner');

var {
  View,
  Text,
  Image,
  StyleSheet
} = React

var styles = StyleSheet.create({
  profilePageContainer: {
    flex: 1
  },
  profileContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,124,158,.2)'
  },
  fullName: {
    textAlign: 'center',
    fontSize: 30,
    borderWidth: 1,
    borderColor: '#007C9E',
    borderRadius: 5,
    margin: 5,
    backgroundColor: 'white'
  },
  profilePictureContainer: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5
  },
  profileImage: {
    width: 150,
    height: 230
  },
  fanCount: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: '800'
  },
  bio: {
    flex: 2,
    alignSelf: 'auto',
    margin: 30
  }
});

var ProfilePage = React.createClass({

  mixins: [
    Unicycle.listenTo(profileStore)
  ],

  render: function() {
    var firstName = profileStore.getFirstName(),
        lastName = profileStore.getLastName(),
        bio = profileStore.getBio(),
        numFans = profileStore.getNumFollowers(),
        profileImageUrl = profileStore.getProfileImageUrl();

    return (
    <View style={styles.profilePageContainer}>
      <MainScreenBanner
        title="My Profile"
        subTitle="Hey look, its you!"/>
      <View style={styles.profileContainer}>
        <Text style={styles.fullName}>{firstName} {lastName}</Text>
        <View style={styles.profilePictureContainer}>
          <Image style={styles.profileImage}
                 source={{uri: profileImageUrl}} />
        </View>
        <Text style={styles.fanCount}>{this._getFansText(numFans)}</Text>
        <Text style={styles.bio}>{bio}</Text>
      </View>
    </View>
    )
  },

  _getFansText: function(numFans) {
    if (numFans == 0) {
      return 'No fans :(';
    }
    else if (numFans == 1) {
      return numFans + ' fan';
    }
    else {
      return numFans + ' fans';
    }
  }

});

module.exports = ProfilePage;
