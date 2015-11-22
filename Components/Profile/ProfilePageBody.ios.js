'use strict';

var React = require('react-native');
var FollowUnfollowButton = require('./FollowUnfollowButton');
var FollowingButton = require('./FollowingButton');
var EditSettingsButton = require('./Settings/EditSettingsButton');

var {
  View,
  Text,
  Image,
  StyleSheet
} = React

var styles = StyleSheet.create({
  profileBodyContent: {
    flex: 1,
    paddingBottom: 50
  },
  fullName: {
    textAlign: 'center',
    fontSize: 30,
    margin: 5
  },
  profilePictureContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5
  },
  profilePicture: {
    borderRadius: 50,
    margin: 25,
    width: 150,
    height: 150
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
    viewerIsProfileOwner: React.PropTypes.bool.isRequired,
    email: React.PropTypes.string
  },

  render: function() {
    var viewerIsProfileOwner = this.props.viewerIsProfileOwner,
        firstName = this.props.firstName,
        lastName = this.props.lastName,
        bio = this.props.bio,
        numFans = this.props.numFans,
        profileImageUrl = this.props.profileImageUrl,
        email = this.props.email,
        followButton = <View/>,
        followingButton = <View/>,
        editSettingsIcon = <View/>;

    if (viewerIsProfileOwner) {
      followingButton = <FollowingButton email={email}/>
      editSettingsIcon = <EditSettingsButton />
    }
    else {
      followButton = <FollowUnfollowButton email={email}/>
    }

    //this should be removed or moved to the api before release
    if (!bio) {
      bio = "I haven't filled out my bio yet because I am a noob";
    }

    return (
      <View style={styles.profileBodyContent}>

        <Text style={styles.fullName}>{firstName} {lastName}</Text>
        { editSettingsIcon }
        <View style={styles.profilePictureContainer}>
          <Image style={styles.profilePicture}
                 source={{uri: 'https://s3-us-west-2.amazonaws.com/misc-youni-files/snoop_dogg.jpg'}} />
        </View>
        <Text style={styles.fanCount}>{this._getFansText(numFans)}</Text>
        <Text style={styles.bio}>{bio}</Text>
        {followButton}
        {followingButton}

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
