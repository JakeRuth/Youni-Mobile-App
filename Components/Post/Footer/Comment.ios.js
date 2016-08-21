'use strict';

var React = require('react');
var ReactNative = require('react-native');
var DismissKeyboard = require('dismissKeyboard');
var Unicycle = require('../../../Unicycle');

var ProfilePopup = require('../../PopupPages/ProfilePopup');
var ProfileImageThumbnail = require('../../Common/ProfileImageThumbnail');

var Colors = require('../../../Utils/Common/Colors');
var IosStatusBarStyles = require('../../../Utils/Common/IosStatusBarStyles');
var statusBarStyleStore = require('../../../stores/StatusBarStyleStore');
var userLoginMetadataStore = require('../../../stores/UserLoginMetadataStore');

var {
  View,
  Text,
  TouchableHighlight,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingBottom: 8
  },
  profilePictureContainer: {
    marginRight: 8
  },
  profilePicture: {
    height: 32,
    width: 32,
    borderRadius: 8
  },
  nameAndTextContainer: {
    flex: 1
  },
  commenterName: {
    textAlign: 'left',
    color: Colors.DARK_GRAY,
    fontSize: 12
  },
  commentText: {
    textAlign: 'left',
    fontSize: 14,
    fontWeight: '300',
    color: Colors.DARK_GRAY
  }
});

var Comment = React.createClass({

  propTypes: {
    commenterName: React.PropTypes.string.isRequired,
    commentText: React.PropTypes.string.isRequired,
    commenterEmail: React.PropTypes.string,
    commenterProfilePicture: React.PropTypes.string,
    navigator: React.PropTypes.object.isRequired
  },

  // TODO: If you want to get mad, change this top level TouchableHighlight to a View, for some reason
  // it makes it so that you can't scroll through comments... I can't figure out why
  render: function() {
    return (
      <TouchableHighlight
        underlayColor="transparent"
        onPress={() => DismissKeyboard()}>

        <View style={styles.container}>

          <TouchableHighlight
            style={styles.profilePictureContainer}
            underlayColor="transparent"
            onPress={this._onCommenterNamePress}>
            <View>
              <ProfileImageThumbnail
                style={styles.profilePicture}
                profileImageUrl={this.props.commenterProfilePicture}/>
            </View>
          </TouchableHighlight>

          <View style={styles.nameAndTextContainer}>
            <Text
              style={styles.commenterName}
              numberOfLines={1}>
              {this.props.commenterName}
            </Text>
            <Text style={styles.commentText}>
              {this.props.commentText}
            </Text>
          </View>

        </View>

      </TouchableHighlight>
    );
  },

  _onCommenterNamePress: function() {
    var userEmail = userLoginMetadataStore.getEmail();

    // commenterEmail could be null.  when a user comments on the post and we add the comment json to the
    // comment list, we don't populate the email.  Which is OK, since it's only used to render the profile popup
    // and you aren't allowed to view your own profile from a popup
    if (this.props.commenterEmail && userEmail !== this.props.commenterEmail) {
      this.props.navigator.push({
        component: ProfilePopup,
        passProps: {
          profileUserEmail: this.props.commenterEmail,
          onBackArrowPress: () => statusBarStyleStore.setStyle(IosStatusBarStyles.LIGHT_CONTENT)
        }
      })
    }
  }

});

module.exports = Comment;
