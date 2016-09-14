'use strict';

var React = require('react');
var ReactNative = require('react-native');

var EmptyResults = require('../../Common/EmptyResults');
var UserListItem = require('../../Common/UserListItem');
var LoadMoreButton = require('../../Common/LoadMoreButton');

var followRelationshipStore = require('../../../stores/profile/FollowRelationshipStore');
var UserFollowRelationshipFilter = require('../../../Utils/Enums/UserFollowRelationshipFilter');

var {
  View,
  StyleSheet,
  ScrollView
} = ReactNative;

var styles = StyleSheet.create({
  allFollowingListContainer: {
    flex: 1,
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 5
  },
  scrollBar: {
    backgroundColor: 'transparent'
  }
});

var AllFollowingResultList = React.createClass({

  propTypes: {
    users: React.PropTypes.array.isRequired,
    isLoading: React.PropTypes.bool.isRequired,
    moreToFetch: React.PropTypes.bool.isRequired,
    onLoadMorePress: React.PropTypes.func.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    var content;

    if (!this.props.users.length) {
      content = <EmptyResults message={this._getEmptyResultsMessage()}/>
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
      <ScrollView
        style={styles.scrollBar}
        automaticallyAdjustContentInsets={false}>

        {userResults}
        <LoadMoreButton
          isLoading={this.props.isLoading}
          isVisible={this.props.moreToFetch}
          onPress={this.props.onLoadMorePress}/>

      </ScrollView>
    );
  },

  _getEmptyResultsMessage: function() {
    if (followRelationshipStore.getSelectedFilter() === UserFollowRelationshipFilter.FOLLOWING) {
      return "You aren't following anyone!";
    }
    else {
      return "No fans";
    }
  }

});

module.exports = AllFollowingResultList;
