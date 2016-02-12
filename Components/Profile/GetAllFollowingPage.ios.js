'use strict';

var React = require('react-native');
var AllFollowingResultList = require('./AllFollowingResultList');
var getAllFollowingStore = require('../../stores/user/GetAllFollowingStore');
var Spinner = require('../Common/Spinner');

var {
  View,
  Text,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  getAllFollowingPageContainer: {
    flex: 1
  },
  spinnerContainer: {
    paddingTop: 10
  }
});

var GetAllFollowingPage = React.createClass({

  render: function() {
    var isRequestInFlight = getAllFollowingStore.isRequestInFlight(),
        allFollowing = getAllFollowingStore.getAllFollowing(),
        content;

    if (isRequestInFlight) {
      content = (
          <View style={styles.spinnerContainer}>
            <Spinner/>
          </View>
      );
    }
    else {
      content = <AllFollowingResultList users={allFollowing}/>
    }

    return (
      <View style={styles.container}>
        { content }
      </View>
    );
  }

});

module.exports = GetAllFollowingPage;
