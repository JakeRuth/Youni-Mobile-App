'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Unicycle = require('../../Unicycle');
var LoadMoreButton = require('../Common/LoadMoreButton');
var PostPopup = require('../PopupPages/PostPopup');
var ProfilePopup = require('../PopupPages/ProfilePopup');
var notificationStore = require('../../stores/NotificationStore');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var NotificationUtils = require('../../Utils/Notification/NotificationUtils');

var {
  View,
  Text,
  Image,
  TouchableHighlight,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  itemContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    height: 50,
    backgroundColor: 'white',
    borderBottomColor: '#F0F0F0',
    borderBottomWidth: 1,
    marginBottom: 1,
    padding: 5
  },
  label: {
    flex: 7,
    textAlign: 'left',
    color: '#525252',
    fontSize: 13,
    marginLeft: 5,
    paddingTop: 15,
    paddingBottom: 15
  },
  senderName: {
    color: '#5C7CFF'
  },
  thumbnailContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 40
  },
  thumbnailImage: {
    height: 40,
    width: 40,
    resizeMode: "cover",
    borderRadius: 3
  },
  profileThumbnailImage: {
    borderRadius: 20
  },
  thumbnailIcon: {
    flex: 1,
    height: 40,
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
      loadMoreNotificationsButton = (
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
    }

    if (!this.props.notification.isRead) {
      unreadNotificationStyle = { backgroundColor: '#C9D4FF' }
    }

    if (!NotificationUtils.isValidNotificationType(this.props.notification.type)) {
      // for backwards compatibility with API versions, if the notification type isn't understood
      // then we shouldn't render anything
      return <View/>;
    }

    return (
      <View style={styles.container}>

        <View style={[styles.itemContainer, unreadNotificationStyle]}>
          {this._renderThumbnail(this.props.notification)}
          {this._renderLabel()}
          {this._renderNotificationTypeIcon(this.props.notification.type)}
        </View>
        {loadMoreNotificationsButton}

      </View>
    );
  },

  _renderLabel: function() {
    var notification = this.props.notification;

    return (
      <Text
        style={styles.label}
        onPress={this._onLabelPress}>

        <Text style={styles.senderName}>
          {notification.senderName + ' '}
        </Text>
        {notification.label}

      </Text>
    );
  },

  _renderNotificationTypeIcon: function(type) {
    var iconName, iconColor;

    if (type === NotificationUtils.TYPE_LIKE) {
      iconName = 'ios-star';
      iconColor = '#FCDD00';
    }
    else if (type === NotificationUtils.TYPE_COMMENT) {
      iconName = 'ios-chatbubble-outline';
      iconColor = '#5C7CFF';
    }
    else if (type === NotificationUtils.TYPE_FOLLOW) {
      iconName = 'social-usd-outline';
      iconColor = '#2CD47A';
    }
    else {
      return <View/>;
    }

    return (
      <View style={styles.thumbnailContainer}>
        <Icon
          style={styles.thumbnailIcon}
          name={iconName}
          size={40}
          color={iconColor}/>
      </View>
    );
  },

  _renderThumbnail: function(notification) {
    if (notification.post) {
      return this._renderPostThumbail(notification.post);
    }
    else if (notification.type === NotificationUtils.TYPE_FOLLOW) {
      return this._renderLikeThumbnail();
    }
  },

  _renderPostThumbail: function(post) {
    return (
      <TouchableHighlight
        style={styles.thumbnailContainer}
        onPress={() => {
          this.props.navigator.push({
            component: PostPopup,
            passProps: {post: post}
          });
        }}
        underlayColor="transparent">
        <Image
          style={styles.thumbnailImage}
          source={{uri: post.photoUrl}}/>
      </TouchableHighlight>
    );
  },

  _renderLikeThumbnail: function() {
    return (
      <TouchableHighlight
        style={styles.thumbnailContainer}
        onPress={() => {
          this.props.navigator.push({
            component: ProfilePopup,
            passProps: {profileUserEmail: this.props.notification.senderEmail}
          });
        }}
        underlayColor="transparent">
        <Image
          style={styles.thumbnailImage}
          source={{uri: this.props.notification.senderUserProfileImageUrl}}/>
      </TouchableHighlight>
    );
  },

  _onLabelPress: function() {
    if (this.props.notification.senderEmail !== userLoginMetadataStore.getEmail()) {
      this.props.navigator.push({
        component: ProfilePopup,
        passProps: {profileUserEmail: this.props.notification.senderEmail}
      });
    }
  }

});

module.exports = NotificationsListItem;
