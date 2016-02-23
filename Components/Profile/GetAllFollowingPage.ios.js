'use strict';

var React = require('react-native');
var AllFollowingResultList = require('./AllFollowingResultList');
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

  propTypes: {
    loading: React.PropTypes.bool.isRequired,
    users: React.PropTypes.array.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function () {
    var content;

    if (this.props.loading) {
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
      </View>
    );
  }

});

module.exports = GetAllFollowingPage;
