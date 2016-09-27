'use strict'

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');

var PostActionButton = require('./PostActionButton');

var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var Colors = require('../../Utils/Common/Colors');


var {
  ActionSheetIOS,
  AlertIOS
} = ReactNative;

var FlagPostIcon = React.createClass({

  propTypes: {
    postId: React.PropTypes.string.isRequired
  },

  render: function() {
    return <PostActionButton onPress={this._onFlagPostIconPress}/>;
  },

  _onFlagPostIconPress: function() {
    ActionSheetIOS.showActionSheetWithOptions({
      options: [
        'Flag Post',
        'Cancel'
      ],
      cancelButtonIndex: 1,
      tintColor: Colors.getPrimaryAppColor()
    },
    (buttonIndex) => {
      if (buttonIndex === 0) {
        this._flagPost();
        this._showFlagPostConfirmation();
      }
    });
  },

  _flagPost: function() {
    var userId = userLoginMetadataStore.getUserId();

    //TODO: Think if we may want to implement some feedback here
    AjaxUtils.ajax(
      '/post/flag',
      {
        postIdString: this.props.postId,
        reporterUserIdString: userId
      },
      (res) => {
      },
      () => {
      }
    );
  },

  _showFlagPostConfirmation: function() {
    AlertIOS.alert(
      'Post flagged',
      '',
      [
        {text: 'Got it'}
      ]
    )
  }

});

module.exports = FlagPostIcon;
