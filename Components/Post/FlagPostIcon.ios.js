'use strict'

var React = require('react-native');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var Icon = require('react-native-vector-icons/MaterialIcons');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');

var {
  TouchableHighlight,
  ActionSheetIOS,
  AlertIOS,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  flagIconContainer: {
    paddingLeft: 30
  }
});

var PostHeader = React.createClass({

  propTypes: {
    postId: React.PropTypes.string.isRequired
  },

  render: function() {
    return (
      <TouchableHighlight
        style={styles.flagIconContainer}
        underlayColor='transparent'
        onPress={this._onFlagPostIconPress}>

        <Icon
          name='more-vert'
          size={23}
          color='#B2B2B2' />

      </TouchableHighlight>
    );
  },

  _onFlagPostIconPress: function() {
    ActionSheetIOS.showActionSheetWithOptions({
      options: [
        'Flag Post',
        'Cancel'
      ],
      cancelButtonIndex: 1,
      tintColor: '#5d6aff'
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

module.exports = PostHeader;
