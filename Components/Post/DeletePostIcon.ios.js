'use strict'

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var Icon = require('react-native-vector-icons/MaterialIcons');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var {
  TouchableHighlight,
  ActionSheetIOS,
  StyleSheet,
  AlertIOS
} = React;

var styles = StyleSheet.create({
  deleteIconContainer: {
    paddingLeft: 30
  }
});

var DeletePostIcon = React.createClass({

  propTypes: {
    id: React.PropTypes.number.isRequired,
    postIdString: React.PropTypes.string.isRequired,
    enabled: React.PropTypes.string.isRequired
  },

  render: function() {
    return (
      <TouchableHighlight
        style={styles.deleteIconContainer}
        underlayColor='transparent'
        onPress={this._onDeleteIconPress}>

        <Icon
          name='more-vert'
          size={23}
          color='#B2B2B2' />

      </TouchableHighlight>
    );
  },

  _onDeleteIconPress: function() {
    ActionSheetIOS.showActionSheetWithOptions({
      options: [
        'Delete Post',
        'Cancel'
      ],
      cancelButtonIndex: 1,
      tintColor: '#0083D4',
    },
    (buttonIndex) => {
      if (buttonIndex === 0) {
        this._onConfirmDeletePress();
      }
    });
  },

  _onConfirmDeletePress: function() {
    var userId = userLoginMetadataStore.getUserId();

    if (this.props.enabled) {
      Unicycle.exec('deletePost', this.props.id, this.props.postIdString, userId);
    }
    else {
      AlertIOS.alert(
        'You can only delete your posts from your profile page.',
        '',
        [
          {
            text: 'Got it'
          }
        ]
      );
    }
  }

});

module.exports = DeletePostIcon;
