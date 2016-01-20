'use strict'

var React = require('react-native');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var Icon = require('react-native-vector-icons/Ionicons');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');

var {
  TouchableHighlight,
  ActionSheetIOS,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  flagIcon: {
    paddingBottom: 15,
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
        style={styles.flagIcon}
        underlayColor='transparent'
        onPress={this._onFlagPostIconPress}>

        <Icon
          name='chevron-down'
          size={15}
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
      tintColor: '#0083D4',
    },
    (buttonIndex) => {
      if (buttonIndex === 0) {
        this._flagPost();
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
  }

});

module.exports = PostHeader;
