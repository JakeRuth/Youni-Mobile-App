'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var {
  View,
  Image,
  Text,
  StyleSheet,
  NativeModules,
  TouchableHighlight
} = React

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 15
  },
  totalCountContainer: {
    flex: 1,
    padding: 10,
  },
  countLabel: {
    color: '#ADADAD',
    fontSize: 12,
    fontWeight: '200',
    textAlign: 'center',
    marginBottom: 1
  },
  countValue: {
    color: '#5C7CFF',
    textAlign: 'center',
    fontSize: 18,
    marginTop: 1
  }
});

var TotalProfileCountsContainer = React.createClass({

  propTypes: {
    // TODO: Fix.  It should always be a number.
    totalPoints: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ]),
    numFollowers: React.PropTypes.number.isRequired,
    numPosts: React.PropTypes.number.isRequired
  },

  render: function() {
    return (
      <View style={styles.profileImageContainer}>
        {this.renderPostsAndFansCounterContainer()}
      </View>
    );
  },

  renderPostsAndFansCounterContainer: function() {
    return (
      <View style={styles.container}>

        <View style={styles.totalCountContainer}>
          <Text style={styles.countLabel}>Points</Text>
          <Text style={styles.countValue}>{this.props.totalPoints}</Text>
        </View>

        <View style={styles.totalCountContainer}>
          <Text style={styles.countLabel}>Fans</Text>
          <Text style={styles.countValue}>{this.props.numFollowers}</Text>
        </View>

        <View style={styles.totalCountContainer}>
          <Text style={styles.countLabel}>Posts</Text>
          <Text style={styles.countValue}>{this.props.numPosts}</Text>
        </View>

      </View>
    );
  },

});

module.exports = TotalProfileCountsContainer;
