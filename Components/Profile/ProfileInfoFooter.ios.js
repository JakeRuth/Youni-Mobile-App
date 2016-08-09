'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');

var FollowUnfollowButton = require('./FollowUnfollowButton');
var UserFollowingListPopup = require('../PopupPages/UserFollowingListPopup');
var PrettyTouchable = require('../Common/PrettyTouchable');
var Colors = require('../../Utils/Common/Colors');
var PostViewType = require('../../Utils/Enums/PostViewType');

var {
  View,
  Text,
  TouchableHighlight,
  Dimensions,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  controlsAndFollowButtonContainer: {
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
  },
  postCountContainer: {
    backgroundColor: Colors.WHITE_SMOKE,
    alignItems: 'center',
    justifyContent: 'center'
  },
  postCountLabel: {
    fontSize: 14,
    padding: 10
  }
});

var ProfileInfoFooter = React.createClass({

  propTypes: {
    isFollowing: React.PropTypes.bool,
    followAction: React.PropTypes.func,
    unfollowAction: React.PropTypes.func,
    currentPostViewMode: React.PropTypes.oneOf([PostViewType.GRID, PostViewType.LIST]).isRequired,
    onPostViewControlPress: React.PropTypes.func.isRequired,
    navigator: React.PropTypes.object.isRequired,
    viewerIsProfileOwner: React.PropTypes.bool
  },

  render: function() {
    var postGridIconColor, postListIconColor;

    if (this.props.currentPostViewMode === PostViewType.LIST) {
      postGridIconColor = Colors.MED_GRAY;
      postListIconColor = Colors.getPrimaryAppColor();
    }
    else {
      postGridIconColor = Colors.getPrimaryAppColor();
      postListIconColor = Colors.MED_GRAY;
    }

    return (
      <View>
        <View style={styles.controlsAndFollowButtonContainer}>

          <TouchableHighlight
            style={styles.postDisplayFormatLeftControl}
            underlayColor="transparent"
            onPress={() => { this.props.onPostViewControlPress(PostViewType.LIST); }}>
            <Icon
              name='android-menu'
              size={28}
              color={postListIconColor}/>
          </TouchableHighlight>

          <View style={styles.separator}/>

          <View style={styles.followButton}>
            {this._renderButton()}
          </View>

          <View style={styles.separator}/>

          <TouchableHighlight
            style={styles.postDisplayFormatRightControl}
            underlayColor="transparent"
            onPress={() => { this.props.onPostViewControlPress(PostViewType.GRID); }}>
            <Icon
              name='android-apps'
              size={28}
              color={postGridIconColor}/>
          </TouchableHighlight>

        </View>
        {this._renderPostCount()}
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
          width: Dimensions.get('window').width * .4,
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
  },

  _renderPostCount: function() {
    return (
      <View style={styles.postCountContainer}>
        <Text style={[styles.postCountLabel, { color: Colors.getPrimaryAppColor() }]}>
          {this.props.user.numPosts + ' Posts'}
        </Text>
      </View>
    );
  }

});

module.exports = ProfileInfoFooter;
