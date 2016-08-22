'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');
var Unicycle = require('../../Unicycle');

var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var profileOwnerStore = require('../../stores/profile/ProfileOwnerStore');
var Colors = require('../../Utils/Common/Colors');
var PostViewType = require('../../Utils/Enums/PostViewType');

var {
  TouchableHighlight,
  ActionSheetIOS,
  AlertIOS
} = ReactNative;

var DeletePostIcon = React.createClass({

  propTypes: {
    id: React.PropTypes.number.isRequired,
    postIdString: React.PropTypes.string.isRequired,
    enabled: React.PropTypes.bool,
    navigator: React.PropTypes.object
  },

  render: function() {
    return (
      <TouchableHighlight
        underlayColor='transparent'
        onPress={this._onDeleteIconPress}>

        <Icon
          name='more-horiz'
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
      tintColor: Colors.getPrimaryAppColor()
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

    if (profileOwnerStore.getPostViewMode() === PostViewType.GRID) {
      this.props.navigator.pop();
    }
  }

});

module.exports = DeletePostIcon;
