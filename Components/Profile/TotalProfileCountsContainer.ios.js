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
    borderTopWidth: .5,
    borderBottomWidth: .5,
    borderColor: '#F2F2F2',
    flex: 2,
    flexDirection: 'row'
  },
  totalCountContainer: {
    flex: 1,
    margin: 2.5,
    padding: 6,
  },
  verticalLineSeperator:{
    borderWidth: .5,
    marginVertical: 8,
    borderColor: '#F2F2F2'
  },
  countLabel: {
    color: '#999',
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 1
  },
  countValue: {
    color: '#1599ED',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
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
          <Text style={styles.countLabel}>Posts</Text>
          <Text style={styles.countValue}>{this.props.numPosts}</Text>
        </View>

        <View style={styles.verticalLineSeperator}/>

        <View style={styles.totalCountContainer}>
          <Text style={styles.countLabel}>Fans</Text>
          <Text style={styles.countValue}>{this.props.numFans}</Text>
        </View>

      </View>
    );
  },

});

module.exports = TotalProfileCountsContainer;
