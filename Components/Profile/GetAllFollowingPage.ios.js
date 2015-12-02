'use strict';

var React = require('react-native');
var AllFollowingResultList = require('./AllFollowingResultList');
var getAllFollowingStore = require('../../stores/user/GetAllFollowingStore');
var BackButtonBar = require('../Common/BackButtonBar');

var {
  View,
  Text,
  StyleSheet,
  ActivityIndicatorIOS
} = React

var styles = StyleSheet.create({
  getAllFollowingPageContainer: {
    flex: 1
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

var GetAllFollowingPage = React.createClass({

  render: function() {
    var isRequestInFlight = getAllFollowingStore.isRequestInFlight(),
        allFollowing = getAllFollowingStore.getAllFollowing(),
        content;

    if (isRequestInFlight) {
      content = <PageLoading/>;
    }
    else {
      content = <AllFollowingResultList users={allFollowing} />
    }

    return (
      <View style={{flex:1}}>
        <BackButtonBar buttonOnPress={this._onBackButtonPress}/>
        <View style={styles.getAllFollowingPageContainer}>
          <Text style={styles.title}>{"Classmates I'm Following"}</Text>
          { content }
        </View>
      </View>
    );
  },

  _onBackButtonPress: function() {
    getAllFollowingStore.setIsInView(false);
  }

});

var PageLoading = React.createClass({

  render: function() {
    return (
      <View style={styles.spinnerContainer}>
        <ActivityIndicatorIOS
          size="small"
          color="black"
          animating={true}
          style={styles.spinner} />
      </View>
    );
  }

});

module.exports = GetAllFollowingPage;