'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var Icon = require('react-native-vector-icons/Ionicons');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var Colors = require('../../Utils/Common/Colors');

var {
  TouchableHighlight,
  ActionSheetIOS,
  AlertIOS
} = React;

var DeletePostIcon = React.createClass({

  propTypes: {
    id: React.PropTypes.number.isRequired,
    postIdString: React.PropTypes.string.isRequired,
    enabled: React.PropTypes.bool
  },

  render: function() {
    return (
      <TouchableHighlight
        underlayColor='transparent'
        onPress={this._onDeleteIconPress}>

        <Icon
          name='android-more-horizontal'
          size={30}
          color={Colors.DARK_GRAY}/>

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
      tintColor: Colors.YOUNI_PRIMARY
    },
    (buttonIndex) => {
      if (buttonIndex === 0) {
        this._showAreYouSureDeletePostPrompt();
      }
    });
  },

  _showAreYouSureDeletePostPrompt: function() {
    AlertIOS.alert(
      'Delete Post',
      'Are you sure you want to permanently remove this post from Youni?',
      [
        {
          text: 'Yes',
          onPress: this._onConfirmDeletePress
        },
        {
          text: 'No'
        }
      ]
    );
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
