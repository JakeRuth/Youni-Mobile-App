'use strict';

var React = require('react-native');
var Unicycle = require('../../../../Unicycle');
var postLikePopupStore = require('../../../../stores/post/like/PostLikePopupStore');
var Spinner = require('../../../Common/Spinner');

var {
  View,
  Text,
  Image,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  container: {
    paddingTop: 15
  },
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
    likerUsers: React.PropTypes.array.isRequired
  },

  mixins: [
    Unicycle.listenTo(postLikePopupStore)
  ],

  render: function() {
    var isRequestInFlight = postLikePopupStore.isRequestInFlight(),
        userRow = [],
        content;

    if (isRequestInFlight) {
      content = (
        <Spinner/>
      );
    }
    else {
      var users = this.props.likerUsers;
      for (var i = 0; i < users.size; i++) {
        userRow.push(
            this._renderUser(users.get(i))
        );
      }
      content = userRow;
    }

    return (
      <View style={styles.container}>
        {content}
      </View>
    );
  },

  _renderUser: function(user) {
    return (
      <View style={styles.userRow}>

        <Image
            style={styles.userImage}
            source={{uri: user.get('profileImageUrl')}}/>
        <Text style={styles.displayName}>
          {user.get('firstName')} {user.get('lastName')}
        </Text>

      </View>
    );
  }

});

module.exports = PostLikesList;
