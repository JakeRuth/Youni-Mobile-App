'use strict';

var React = require('react-native');
var FollowUnfollowButton = require('./FollowUnfollowButton');

var {
  View,
  Text,
  Image,
  StyleSheet
} = React

var styles = StyleSheet.create({
  profileBodyContent: {
    flex: 1,
    paddingBottom: 20
  },
  fullName: {
    backgroundColor: 'rgba(0,124,158,.2)',
    textAlign: 'center',
    fontSize: 30,
    borderWidth: 1,
    borderRadius: 5,
    margin: 5
  },
  profilePictureContainer: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5
  },
  profileImage: {

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

var ProfilePageBody = React.createClass({

  propTypes: {
    firstName: React.PropTypes.string.isRequired,
    lastName: React.PropTypes.string.isRequired,
    bio: React.PropTypes.string.isRequired,
    numFans: React.PropTypes.number.isRequired,
    profileImageUrl: React.PropTypes.string.isRequired,
    email: React.PropTypes.string
  },

  render: function() {
    var firstName = this.props.firstName,
        lastName = this.props.lastName,
        bio = this.props.bio,
        numFans = this.props.numFans,
        profileImageUrl = this.props.profileImageUrl,
        email = this.props.email;

    var followButton = <View/>; //equivelent null for component
    if (email) {
      followButton = <FollowUnfollowButton email={email}/>
    }

    //this should be removed or moved to the api before release
    if (!bio) {
      bio = "I haven't filled out my bio yet because I am a noob";
    }

    return (
      <View style={styles.profileBodyContent}>
        <Text style={styles.fullName}>{firstName} {lastName}</Text>
        <View style={styles.profilePictureContainer}>
          <Text style={styles.profileImage}>Image Placeholder</Text>
        </View>
        <Text style={styles.fanCount}>{this._getFansText(numFans)}</Text>
        <Text style={styles.bio}>{bio}</Text>
        {followButton}
      </View>
    );
  },

  //TODO: This is more then likely something we want to api to handle
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

module.exports = ProfilePageBody;
