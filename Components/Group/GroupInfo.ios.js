'use strict';

var React = require('react');
var ReactNative = require('react-native');

var GroupStats = require('./GroupStats');
var EditGroupButton = require('./Admin/Edit/EditGroupButton');

var Colors = require('../../Utils/Common/Colors');
var GroupUtils = require('../../Utils/Group/GroupUtils');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var {
  View,
  Image,
  Text,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  coverImage: {
    flex: 1,
    height: 125
  },
  name: {
    color: Colors.DARK_GRAY,
    textAlign: 'center',
    fontWeight: '300',
    fontSize: 17,
    paddingTop: 10
  },
  description: {
    color: Colors.DARK_GRAY,
    fontWeight: '200',
    fontSize: 12,
    padding: 20,
    paddingTop: 2
  },
  adminEditGroupButtonContainer: {
    alignItems: 'center'
  }
});

var GroupInfo = React.createClass({

  propTypes: {
    group: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired,
      abbreviatedName: React.PropTypes.string.isRequired,
      description: React.PropTypes.string.isRequired,
      coverImageUrl: React.PropTypes.string.isRequired,
      badgeImageUrl: React.PropTypes.string.isRequired,
      adminEmails: React.PropTypes.array,
      allTimeTrendPoints: React.PropTypes.number.isRequired,
      numPosts: React.PropTypes.number.isRequired,
      numMembers: React.PropTypes.number.isRequired
    }).isRequired,
    onPageReturnCallback: React.PropTypes.func.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    return (
      <View style={styles.container}>

        <Image
          style={styles.coverImage}
          resizeMode="cover"
          source={{uri: this.props.group.coverImageUrl}}/>

        <Text style={styles.name}>
          {this.props.group.name}
        </Text>
        <Text style={styles.description}>
          {this.props.group.description}
        </Text>

        {this._renderAdminEditGroupButton()}
        <GroupStats {...this.props}/>

      </View>
    );
  },

  _renderAdminEditGroupButton: function() {
    if (GroupUtils.isUserAdmin(this.props.group, userLoginMetadataStore.getEmail())) {
      return (
        <View style={styles.adminEditGroupButtonContainer}>
          <EditGroupButton {...this.props}/>
        </View>
      );
    }
  }

});

module.exports = GroupInfo;
