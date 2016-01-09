'use strict'

var React = require('react-native');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var Icon = require('react-native-vector-icons/Ionicons');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');

var {
  TouchableHighlight,
  AlertIOS,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  flagPostIconContainer: {
    paddingLeft: 30,
    paddingRight: 30,
    alignSelf: 'center'
  }
});

var PostHeader = React.createClass({

  propTypes: {
    postId: React.PropTypes.string.isRequired
  },

  render: function() {
    return (
      <TouchableHighlight
        underlayColor='transparent'
        style={styles.flagPostIconContainer}
        onPress={this._onFlagPostIconPress}>

        <Icon
          name='ios-flag-outline'
          size={30}
          color='#FF7878' />

      </TouchableHighlight>
    );
  },

  _onFlagPostIconPress: function() {
    AlertIOS.alert(
      'Flag this post?',
      'An email will be sent to Youni to report this post for inappropriate content.',
      [
        {
          text: 'Yes',
          onPress: this._flagPost
        },
        {
          text: 'No'
        }
      ]
    );
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
