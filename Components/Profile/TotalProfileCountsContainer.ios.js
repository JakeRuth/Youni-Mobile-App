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
    flex: 2,
    flexDirection: 'row'
  },
  totalCountContainer: {
    flex: 1,
    margin: 10
  },
  verticalLineSeperator:{
    borderWidth: 1,
    marginVertical: 5,
    borderColor: 'grey'
  },
  countLabel: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center'
  },
  countValue: {
    color: '#5375FA',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '600'
  }
});

var TotalProfileCountsContainer = React.createClass({

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
          <Text style={styles.countValue}>bitch</Text>
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
