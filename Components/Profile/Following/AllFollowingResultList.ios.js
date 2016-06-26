'use strict';

var React = require('react-native');
var EmptyResults = require('../../Common/EmptyResults');
var UserListItem = require('../../Common/UserListItem');

var {
  View,
  StyleSheet,
  ScrollView
} = React;

var styles = StyleSheet.create({
  allFollowingListContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 5
  },
  scrollBar: {
    backgroundColor: 'transparent'
  }
});

var AllFollowingResultList = React.createClass({

  propTypes: {
    users: React.PropTypes.array.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    var content;

    if (!this.props.users.length) {
      content = <EmptyResults message={"You aren't following anyone!"}/>
    }
    else {
      content = this.renderResultList(this.props.users);
    }

    return (
      <View style={styles.allFollowingListContainer}>
        {content}
      </View>
    );
  },

  renderResultList: function(users) {
    var userResults = [];
    for (var i = 0; i < users.length; i++) {
      userResults.push(
        <UserListItem
          key={i}
          user={users[i]}
          navigator={this.props.navigator}/>
      );
    }

    return (
      <ScrollView style={styles.scrollBar}>
        {userResults}
      </ScrollView>
    );
  }

});

module.exports = AllFollowingResultList;
