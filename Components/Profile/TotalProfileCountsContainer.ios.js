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
    flex: 1,
    flexDirection: 'row',
    marginBottom: 15
  },
  totalCountContainer: {
    flex: 1,
    padding: 10,
  },
  verticalLineSeperator:{
    borderWidth: .5,
    marginVertical: 7,
    borderColor: '#ADADAD'
  },
  countLabel: {
    color: '#ADADAD',
    fontSize: 12,
    fontWeight: '200',
    textAlign: 'center',
    marginBottom: 1
  },
  countValue: {
    color: '#0083D4',
    textAlign: 'center',
    fontSize: 20,
    marginTop: 1
  }
});

var TotalProfileCountsContainer = React.createClass({

  propTypes: {
    numFans: React.PropTypes.number.isRequired,
    numPosts: React.PropTypes.number.isRequired
  },

  render: function() {
    return (
      <View style={styles.profileImageContainer}>
        {this.renderPostsAndFansCounterContainer()}
      </View>
    );
  },

  //TODO: Once posts come from api, use that value!!!
  renderPostsAndFansCounterContainer: function() {
    return (
      <View style={styles.container}>

        <View style={styles.totalCountContainer}>
          <Text style={styles.countLabel}>Points</Text>
          <Text style={styles.countValue}>{'213k'}</Text>
        </View>

        <View style={styles.verticalLineSeperator}/>

        <View style={styles.totalCountContainer}>
          <Text style={styles.countLabel}>Fans</Text>
          <Text style={styles.countValue}>{this.props.numFans}</Text>
        </View>

        <View style={styles.verticalLineSeperator}/>

        <View style={styles.totalCountContainer}>
          <Text style={styles.countLabel}>Posts</Text>
          <Text style={styles.countValue}>{this.props.numPosts}</Text>
        </View>

      </View>
    );
  },

});

module.exports = TotalProfileCountsContainer;
