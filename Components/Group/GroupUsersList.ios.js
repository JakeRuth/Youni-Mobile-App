'use strict';

var React = require('react-native');
var UserListItem = require('../Common/UserListItem');
var LoadMoreButton = require('../Common/LoadMoreButton');
var Spinner = require('../Common/Spinner');

var {
  View,
  Text,
  StyleSheet,
  ScrollView
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 5
  },
  spinnerContainer: {
    paddingTop: 10
  }
});

var GroupUsersList = React.createClass({

  propTypes: {
    isLoading: React.PropTypes.bool.isRequired,
    moreToFetch: React.PropTypes.bool.isRequired,
    onLoadMorePress: React.PropTypes.func.isRequired,
    users: React.PropTypes.array.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function () {
    return (
      <View style={styles.container}>

        {this.renderResultList(this.props.users)}
        <LoadMoreButton
          onPress={this.props.onLoadMorePress}
          isLoading={this.props.isLoading}
          isVisible={this.props.moreToFetch}/>
        
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
      <ScrollView>
        {userResults}
      </ScrollView>
    );
  }

});

module.exports = GroupUsersList;
