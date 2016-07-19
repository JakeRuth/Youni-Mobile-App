'use strict';

var React = require('react-native');

var AddGroupUserListItem = require('./AddGroupUserListItem');
var LoadMoreButton = require('../../Common/LoadMoreButton');

var Colors = require('../../../Utils/Common/Colors');

var {
  View,
  ScrollView,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE_SMOKE,
    padding: 20,
    paddingTop: 5
  }
});

var AddGroupUserList = React.createClass({

  propTypes: {
    users: React.PropTypes.array.isRequired,
    groupIdString: React.PropTypes.string.isRequired,
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
      users.push(
        <AddGroupUserListItem
          user={this.props.users[i]}
          groupIdString={this.props.groupIdString}
          key={i}/>
      );
    }

    return (
      <View>
        {users}
      </View>
    );
  }

});

module.exports = AddGroupUserList;
