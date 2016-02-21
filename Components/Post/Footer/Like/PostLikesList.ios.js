'use strict';

var React = require('react-native');
var Unicycle = require('../../../../Unicycle');
var Spinner = require('../../../Common/Spinner');

var {
  View,
  Text,
  Image,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  userRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 5
  },
  userImage: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 10
  },
  displayName: {
    fontSize: 20
  }
});

var PostLikesList = React.createClass({

  propTypes: {
    loading: React.PropTypes.bool.isRequired,
    users: React.PropTypes.array.isRequired
  },

  render: function() {
    var userRows = [],
        content;

    if (this.props.loading) {
      content = (
        <Spinner/>
      );
    }
    else {
      for (var i = 0; i < this.props.users.length; i++) {
        userRows.push(
            this._renderUser(this.props.users[i], i)
        );
      }
      content = userRows;
    }

    return (
      <View>
        {content}
      </View>
    );
  },

  _renderUser: function(user, index) {
    return (
      <View
        style={styles.userRow}
        key={index}>

        <Image
            style={styles.userImage}
            source={{uri: user.profileImageUrl}}/>
        <Text style={styles.displayName}>
          {user.firstName} {user.lastName}
        </Text>

      </View>
    );
  }

});

module.exports = PostLikesList;
