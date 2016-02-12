'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Unicycle = require('../../Unicycle');
var getAllFollowingStore = require('../../stores/user/GetAllFollowingStore');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var EmptyResults = require('../Common/EmptyResults');

var {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  allFollowingListContainer: {
    flex: 1
  },
  scrollBar: {
    backgroundColor: 'transparent'
  },
  result: {
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10
  },
  profileImage: {
    height: 45,
    width: 45,
    borderRadius: 22,
    marginRight: 10
  },
  fullName: {
    flex: 4,
    fontSize: 20,
    alignSelf: 'center'
  },
  blankLine: {
    borderWidth: .3,
    borderColor: 'black',
    margin: 5
  }
});

var AllFollowingResultList = React.createClass({

  propTypes: {
    users: React.PropTypes.object.isRequired
  },

  render: function() {
    var content;

    if (!this.props.users.size) {
      content = <EmptyResults message={"You aren't following anyone!"}/>
    }
    else {
      content = this.renderResultList();
    }

    return (
      <View style={styles.allFollowingListContainer}>
        { content }
      </View>
    );
  },

  renderResultList: function() {
    var usersJson = this.props.users;
    var userResults = [];

    for (var i = 0; i < usersJson.size; i++) {
      userResults.push(
        <Result
          key={i}
          user={usersJson.get(i)} />
      );
    }

    return (
      <ScrollView style={styles.scrollBar}>
        {userResults}
      </ScrollView>
    );
  }

});

var Result = React.createClass({

  propTypes: {
    user: React.PropTypes.object.isRequired
  },

  render: function() {
    var user = this.props.user;
    var firstName = user.get('firstName'),
        lastName = user.get('lastName'),
        email = user.get('email'),
        profileImageUrl = user.get('profileImageUrl'),
        thumbnail;

    if (profileImageUrl) {
      thumbnail = (
        <Image style={styles.profileImage} source={{uri: profileImageUrl}} />
      );
    }
    else {
      thumbnail = (
        <Icon style={styles.profileImage}
          name='ios-person' size={40} color='#0083D4' />
      );
    }

    return (
      <View>
        <TouchableHighlight
          underlayColor='lightgray'
          onPress={this.onResultPress}>

          <View style={styles.result}>
            {thumbnail}
            <Text style={styles.fullName} numberOfLines={1}>{firstName} {lastName}</Text>
          </View>

        </TouchableHighlight>
        <View style={styles.blankLine} />
      </View>
    );
  },

  onResultPress: function() {
    var userId = userLoginMetadataStore.getUserId(),
        userEmail = this.props.user.get('email');

    Unicycle.exec('reInitializeUsersProfileFeedOffset');
    Unicycle.exec('loadUsersProfile', userEmail);
    Unicycle.exec('getUserPosts', userEmail, userId);
    Unicycle.exec('setProfileModalVisibile', true);
  }

});

module.exports = AllFollowingResultList;
