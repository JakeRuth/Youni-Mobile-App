'use strict';

var React = require('react-native');
var Unicycle = require('../../../Unicycle');
var ProfilePopup = require('../../PopupPages/ProfilePopup');
var userLoginMetadataStore = require('../../../stores/UserLoginMetadataStore');
var Color = require('../../../Utils/Common/Colors');

var {
  View,
  Text,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  commenterName: {
    color: Color.YOUNI_PRIMARY_PURPLE,
    padding: 10
  },
  commentText: {
    flex: 1,
    fontSize: 13,
    color: '#525252',
    paddingTop: 4,
    paddingBottom: 4
  }
});

var Comment = React.createClass({

  propTypes: {
    commenterName: React.PropTypes.string.isRequired,
    commentText: React.PropTypes.string.isRequired,
    commenterEmail: React.PropTypes.string,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    return (
      <View style={styles.container}>

        <Text style={styles.commentText}>

          <Text
            style={styles.commenterName}
            numberOfLines={1}
            onPress={this._onCommenterNamePress}>
            {this.props.commenterName + '  '}
          </Text>
          {this.props.commentText}

        </Text>

      </View>
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
