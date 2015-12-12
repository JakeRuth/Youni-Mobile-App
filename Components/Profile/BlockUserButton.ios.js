'use strict';

var React = require('react-native');
var searchStore = require('../../stores/SearchStore');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var Icon = require('react-native-vector-icons/Ionicons');
var request = require('superagent');
var prefix = require('superagent-prefix')('http://greedyapi.elasticbeanstalk.com');

var {
  View,
  TouchableHighlight,
  StyleSheet,
  Text,
  AlertIOS
} = React

var styles = StyleSheet.create({
  blockUserContainer: {
    position: 'absolute',
    top: 10,
    right: 10
  },
  blockUserText: {
    color: '#FF7878',
    fontSize: 10,
    marginTop: -5
  }
});

var BlockUserButton = React.createClass({

  propTypes: {
    email: React.PropTypes.string.isRequired
  },

  render: function() {
    return (
      <TouchableHighlight
        onPress={this._onBlockUserIconPress}
        style={styles.blockUserContainer}
        underlayColor='transparent'>

        <View>
          <Icon
            name='sad'
            size={35}
            color={'#FF7878'} />
          <Text style={styles.blockUserText}>Block</Text>
        </View>

      </TouchableHighlight>
    );
  },

  _onBlockUserIconPress: function () {
    AlertIOS.alert(
      'Permanently block this user?',
      'You cannot undo this action.',
      [
        {
          text: 'Yes',
          onPress: this._blockUser
        },
        {
          text: 'No'
        }

      ]
    );
  },

  _blockUser: function () {
    var userId = userLoginMetadataStore.getUserId();

    request
     .post('/user/block')
     .use(prefix)
     .send({
       requestingUserIdString: userId,
       userToBlockEmail: this.props.email
     })
     .set('Accept', 'application/json')
     .end(function(err, res) {
       //TODO: Do not do this optimistically.  Only perform this if the call was successful, if not show an error message
       //reinitialze search store, now if user searches the blocked user won't show up.
       searchStore.resetSearchPageAfterBlockingUser();
     });
  }

});

module.exports = BlockUserButton;
