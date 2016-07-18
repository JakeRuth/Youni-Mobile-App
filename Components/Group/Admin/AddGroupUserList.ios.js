'use strict';

var React = require('react-native');

var ProfileImageThumbnail = require('../../Common/ProfileImageThumbnail');
var LoadMoreButton = require('../../Common/LoadMoreButton');

var Colors = require('../../../Utils/Common/Colors');
var userLoginMetadataStore = require('../../../stores/UserLoginMetadataStore');

var {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 5
  },
  userInfoContainer: {
    marginTop: 10,
    marginBottom: 10
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  name: {
    flex: 1,
    color: Colors.DARK_GRAY,
    fontSize: 16,
    fontWeight: '300',
    marginLeft: 20
  }
});

var AddGroupUserList = React.createClass({

  propTypes: {
    users: React.PropTypes.array.isRequired,
    isLoading: React.PropTypes.bool.isRequired,
    moreToFetch: React.PropTypes.bool.isRequired,
    onLoadMorePress: React.PropTypes.func.isRequired
  },

  render: function() {
    return (
      <ScrollView
        style={styles.container}
        automaticallyAdjustContentInsets={false}>

        {this._renderUserList()}
        <LoadMoreButton
          onPress={this.props.onLoadMorePress}
          isLoading={this.props.isLoading}
          isVisible={this.props.moreToFetch}/>

      </ScrollView>
    );
  },

  _renderUserList: function() {
    var users = [];

    for (var i = 0; i < this.props.users.length; i++) {
      users.push(this._renderUser(this.props.users[i], i));
    }

    return (
      <View>
        {users}
      </View>
    );
  },

  _renderUser: function(user, index) {
    return (
      <TouchableHighlight
        style={styles.userInfoContainer}
        underlayColor="transparent"
        onPress={this._onPress}
        key={index}>

        <View style={styles.userInfo}>
          <ProfileImageThumbnail profileImageUrl={user.profileImageUrl}/>
          <Text style={styles.name}>
            {`${user.firstName} ${user.lastName}`}
          </Text>
        </View>

      </TouchableHighlight>
    );
  }

});

module.exports = AddGroupUserList;
