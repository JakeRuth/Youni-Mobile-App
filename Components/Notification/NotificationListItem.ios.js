'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');
var Unicycle = require('../../Unicycle');

var LoadMoreButton = require('../Common/LoadMoreButton');
var ProfileImageThumbnail = require('../Common/ProfileImageThumbnail');
var GroupThumbnailLink = require('../Group/GroupThumbnailLink');
var PostPopup = require('../PopupPages/PostPopup');
var ProfilePopup = require('../PopupPages/ProfilePopup');

var notificationStore = require('../../stores/NotificationStore');
var profileOwnerStore = require('../../stores/profile/ProfileOwnerStore');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var statusBarStyleStore = require('../../stores/StatusBarStyleStore');

var NotificationUtils = require('../../Utils/Notification/NotificationUtils');
var Colors = require('../../Utils/Common/Colors');
var IosStatusBarStyles = require('../../Utils/Common/IosStatusBarStyles');

var {
  View,
  Text,
  Image,
  TouchableHighlight,
  StyleSheet,
  Dimensions
} = ReactNative;

var styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 1,
    padding: 10
  },
  leftImageThumbnailContainer: {
    alignItems: 'center',
    marginRight: 12,
    width: 44
  },
  profileImage: {
    height: 40,
    width: 40,
    borderRadius: 8
  },
  messageContainer: {
    flex: 1,
    marginTop: -7
  },
  senderName: {
    color: Colors.DARK_GRAY,
    fontSize: 14,
    fontWeight: '600'
  },
  message: {
    color: Colors.DARK_GRAY,
    fontSize: 14,
    marginTop: 4
  },
  timestamp: {
    fontSize: 11,
    color: Colors.MED_GRAY
  },
  postImage: {
    height: 40,
    width: 40
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 8
  },
  blankLine: {
    width: Dimensions.get('window').width * (2/3),
    backgroundColor: Colors.LIGHT_GRAY,
    height: .5,
    alignSelf: 'center'
  }
});

var NotificationsListItem = React.createClass({

  propTypes: {
    notification: React.PropTypes.object.isRequired,
    navigator: React.PropTypes.object.isRequired,
    onLoadMoreNotifications: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      wasLoadMoreClicked: false
    };
  },

  mixins: [
    Unicycle.listenTo(notificationStore)
  ],

  render: function () {
    var type = this.props.notification.type,
        unreadNotificationStyle = {},
        content, loadMoreNotificationsButton;

    if (this.props.notification.isLastItem) {
      loadMoreNotificationsButton = this._renderLoadMoreNotificationsButton();
    }

    if (!this.props.notification.isRead) {
      unreadNotificationStyle = { backgroundColor: Colors.LIGHT_PURPLE };
    }

    if (!NotificationUtils.isValidNotificationType(this.props.notification.type)) {
      // for backwards compatibility with API versions, if the notification type isn't understood
      // then we shouldn't render anything
      return <View/>;
    }

    return (
      <View style={unreadNotificationStyle}>

        <View style={styles.itemContainer}>
          {this._renderLeftImageThumbnail(this.props.notification)}
          {this._renderMessage(this.props.notification)}
          {this._renderRightImageThumbnail(this.props.notification)}
        </View>
        <View style={styles.blankLine}/>
        {loadMoreNotificationsButton}

      </View>
    );
  },

  _renderLeftImageThumbnail: function(notification) {
    if (notification.type === NotificationUtils.TYPE_SYSTEM) {
      return (
        <View style={styles.leftImageThumbnailContainer}>
          <Image
            style={[styles.logo, { backgroundColor: Colors.getPrimaryAppColor() }]}
            source={require('../../images/logoWhiteTextBlankBackground.png')}
            resizeMode="contain"/>
        </View>
      );
    }
    else if (notification.type === NotificationUtils.TYPE_FOLLOW) {
      return (
        <View style={styles.leftImageThumbnailContainer}>
          <Icon
            name='person-add'
            size={22}
            color={Colors.getPrimaryAppColor()}/>
        </View>
      );
    }
    else if (notification.type === NotificationUtils.TYPE_ADDED_TO_GROUP) {
      return (
        <GroupThumbnailLink
          style={styles.leftImageThumbnailContainer}
          imageStyle={styles.profileImage}
          group={notification.group}
          hideLabel={true}
          navigator={this.props.navigator}/>
      );
    }
    else if (this.props.notification.senderUser) {
      return (
        <TouchableHighlight
          style={styles.leftImageThumbnailContainer}
          underlayColor="transparent"
          onPress={this._onProfileImagePress}>
          <View>
            <ProfileImageThumbnail
              style={styles.profileImage}
              profileImageUrl={this.props.notification.senderUser.profileImageUrl}/>
          </View>
        </TouchableHighlight>
      );
    }
  },

  _renderMessage: function(notification) {
    var notificationSenderName;

    if (notification.post) {
      notificationSenderName = (
        <Text style={styles.senderName}>
          {notification.senderUser.firstName + ' ' + notification.senderUser.lastName}
        </Text>
      );
    }

    return (
      <View style={styles.messageContainer}>

        {notificationSenderName}
        <Text style={styles.message}>
          {notification.label + '  '}
          <Text style={styles.timestamp}>
            {this.props.notification.timestamp}
          </Text>
        </Text>
      </View>
    );
  },

  _renderRightImageThumbnail: function(notification) {
    if (notification.post) {
      return (
        <TouchableHighlight
          underlayColor="transparent"
          onPress={() => {
            this.props.navigator.push({
              component: PostPopup,
              passProps: {
                post: notification.post
              }
            });
          }}>
          <Image
            style={styles.postImage}
            resizeMode="cover"
            source={{uri: notification.post.photoUrl}}/>
        </TouchableHighlight>
      );
    }
  },

  _renderLoadMoreNotificationsButton: function() {
    return (
      <LoadMoreButton
        onPress={() => {
            this.setState({
              wasLoadMoreClicked: true
            });
            this.props.onLoadMoreNotifications();
          }}
        isLoading={notificationStore.isRequestInFlight()}
        isVisible={notificationStore.isRequestInFlight() || !this.state.wasLoadMoreClicked}/>
    );
  },

  _onProfileImagePress: function() {
    var email = this.props.notification.senderUser.email;
    if (email !== userLoginMetadataStore.getEmail()) {
      this.props.navigator.push({
        component: ProfilePopup,
        passProps: {
          profileUserEmail: email,
          onBackArrowPress: () => statusBarStyleStore.setStyle(IosStatusBarStyles.DEFAULT)
        }
      });
    }
  }

});

module.exports = NotificationsListItem;
