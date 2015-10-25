'use strict';

var React = require('react-native');

var {
  View,
  Text,
  Image,
  StyleSheet
} = React

var styles = StyleSheet.create({
  profileBodyContent: {
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
    profileImageUrl: React.PropTypes.string.isRequired
  },

  render: function() {
    var firstName = this.props.firstName,
        lastName = this.props.lastName,
        bio = this.props.bio,
        numFans = this.props.numFans,
        profileImageUrl = this.props.profileImageUrl;

    return (
      <View style={styles.profileBodyContent}>
        <Text style={styles.fullName}>{firstName} {lastName}</Text>
        <View style={styles.profilePictureContainer}>
          <Text style={styles.profileImage}>Image Placeholder</Text>
        </View>
        <Text style={styles.fanCount}>{this._getFansText(numFans)}</Text>
        <Text style={styles.bio}>{bio}</Text>
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
