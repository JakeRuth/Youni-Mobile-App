'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');

var FollowUnfollowButton = require('./FollowUnfollowButton');
var UserFollowingListPopup = require('../PopupPages/UserFollowingListPopup');
var PrettyTouchable = require('../Common/PrettyTouchable');
var Colors = require('../../Utils/Common/Colors');

var {
  View,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 70,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER_POP
  },
  postDisplayFormatLeftControl: {
    flex: 1,
    marginLeft: 36
  },
  postDisplayFormatRightControl: {
    flex: 1,
    marginRight: 36,
    alignItems: 'flex-end'
  },
  followButton: {
    flex: 4,
    alignItems: 'center'
  },
  separator: {
    height: 36,
    width: 1.5,
    backgroundColor: Colors.MED_GRAY,
    opacity: .4
  }
});

var ProfileInfoFooter = React.createClass({

  propTypes: {
    isFollowing: React.PropTypes.bool,
    followAction: React.PropTypes.func,
    unfollowAction: React.PropTypes.func,
    navigator: React.PropTypes.object.isRequired,
    viewerIsProfileOwner: React.PropTypes.bool
  },

  render: function() {
    // TODO: handle changing controls color if that view is selected or not
    return (
      <View style={styles.container}>

        <Icon
          style={styles.postDisplayFormatLeftControl}
          name='android-menu'
          size={28}
          color={Colors.YOUNI_PRIMARY_PURPLE}/>

        <View style={styles.separator}/>

        <View style={styles.followButton}>
          {this._renderButton()}
        </View>

        <View style={styles.separator}/>

        <View style={styles.postDisplayFormatRightControl}>
          <Icon
            name='android-apps'
            size={28}
            color={Colors.MED_GRAY}/>
        </View>

      </View>
    );
  },

  _renderButton: function() {
    if (this.props.viewerIsProfileOwner) {
      return this._renderFollowingButton();
    }
    else {
      return this._renderFollowUnfollowButton();
    }
  },
  
  _renderFollowingButton: function() {
    return (
      <PrettyTouchable
        label="Following"
        containerStyle={{
            width: 146,
            height: 36
          }}
        onPress={() => {
          this.props.navigator.push({
            component: UserFollowingListPopup
          });
        }}/>
    );
  },
  
  _renderFollowUnfollowButton: function() {
    return <FollowUnfollowButton {...this.props}/>;
  }

});

module.exports = ProfileInfoFooter;
