'use strict';

var React = require('react-native');
var Unicycle = require('../../../Unicycle');
var ProfilePopup = require('../../PopupPages/ProfilePopup');
var userLoginMetadataStore = require('../../../stores/UserLoginMetadataStore');
var Colors = require('../../../Utils/Common/Colors');

var {
  View,
  Text,
  Image,
  TouchableHighlight,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingBottom: 8
  },
  profilePicture: {
    height: 32,
    width: 32,
    borderRadius: 8,
    marginRight: 8
  },
  nameAndTextContainer: {
    flex: 1
  },
  commenterName: {
    textAlign: 'left',
    color: Colors.YOUNI_PRIMARY_PURPLE,
    fontWeight: '100',
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

  render: function() {
    return (
      <TouchableHighlight
        underlayColor="transparent"
        onPress={this._onCommenterNamePress}>

        <View style={styles.container}>
          <Image
            style={styles.profilePicture}
            source={{uri: this.props.commenterProfilePicture}}/>

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
        passProps: {profileUserEmail: this.props.commenterEmail}
      })
    }
  }

});

module.exports = Comment;
