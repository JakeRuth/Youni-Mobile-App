'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');
var Unicycle = require('../../Unicycle');

var PostActionButton = require('./PostActionButton');

var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var profileOwnerStore = require('../../stores/profile/ProfileOwnerStore');
var Colors = require('../../Utils/Common/Colors');
var PostViewType = require('../../Utils/Enums/PostViewType');

var {
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
      <PostActionButton
        {...this.props}
        onPress={this._onDeleteIconPress}/>
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

      if (profileOwnerStore.getPostViewMode() === PostViewType.GRID) {
        this.props.navigator.pop();
      }
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
