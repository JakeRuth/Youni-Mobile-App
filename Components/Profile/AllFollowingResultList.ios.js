'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Unicycle = require('../../Unicycle');
var getAllFollowingStore = require('../../stores/user/GetAllFollowingStore');
var EmptyResults = require('../Common/EmptyResults');

var {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableHighlight
} = React

var styles = StyleSheet.create({
  allFollowingListContainer: {
    flex: 1
  },
  scrollBar: {
    backgroundColor: 'transparent',
    marginBottom: 40 //needed so tab bar doesn't cut off bottom of screen
  },
  result: {
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10
  },
  profileImage: {
    flex: 1
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
      userResults.push(<Result
        key={i}
        user={usersJson.get(i)}
      />);
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
        email = user.get('email');

    return (
      <View>
        <TouchableHighlight underlayColor='lightgray'>

          <View style={styles.result}>
            <Icon style={styles.profileImage}
              name='ios-person' size={40} color={'red'} />
            <Text style={styles.fullName} numberOfLines={1}>{firstName} {lastName}</Text>
          </View>

        </TouchableHighlight>
        <View style={styles.blankLine} />
      </View>
    );
  }

});

module.exports = AllFollowingResultList;
