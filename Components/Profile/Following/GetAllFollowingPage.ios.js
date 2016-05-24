'use strict';

var React = require('react-native');
var AllFollowingResultList = require('./AllFollowingResultList');
var LoadMoreButton = require('../../Common/LoadMoreButton');
var Spinner = require('../../Common/Spinner');

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

  propTypes: {
    initialPageLoading: React.PropTypes.bool.isRequired,
    isLoading: React.PropTypes.bool.isRequired,
    moreToFetch: React.PropTypes.bool.isRequired,
    onLoadMorePress: React.PropTypes.func.isRequired,
    users: React.PropTypes.array.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function () {
    var content;

    if (this.props.initialPageLoading) {
      content = (
        <View style={styles.spinnerContainer}>
          <Spinner/>
        </View>
      );
    }
    else {
      content = (
        <AllFollowingResultList
          users={this.props.users}
          navigator={this.props.navigator}/>
      );
    }

    return (
      <View style={styles.container}>
        {content}
        <LoadMoreButton
          onPress={this.props.onLoadMorePress}
          isLoading={this.props.isLoading}
          isVisible={this.props.moreToFetch}/>
      </View>
    );
  }

});

module.exports = GetAllFollowingPage;
