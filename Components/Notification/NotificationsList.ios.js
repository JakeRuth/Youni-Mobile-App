'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');
var Unicycle = require('../../Unicycle');
var notificationStore = require('../../stores/NotificationStore');
var Spinner = require('../Common/Spinner');
var Colors = require('../../Utils/Common/Colors');
var NotificationListItem = require('./NotificationListItem');

var {
  View,
  Text,
  ListView,
  StyleSheet,
  RecyclerViewBackedScrollView
} = ReactNative;

var styles = StyleSheet.create({
  noNotificationsIndicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  noNotificationsLabel: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '200',
    color: Colors.DARK_GRAY,
    padding: 20
  }
});

var NotificationsList = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows(notificationStore.getFirstPage())
    };
  },

  componentDidMount: function() {
    notificationStore.setOffset(0);
    notificationStore.fetchPage(this._onGetNextPageOfNotificationsCallback, true);
  },

  mixins: [
    Unicycle.listenTo(notificationStore)
  ],

  render: function () {
    var notifications = notificationStore.getFirstPage(),
        that = this;

    if (notificationStore.isInitialPageLoading()) {
      return (
        <Spinner/>
      );
    }
    else if (notifications.length === 0) {
      return (
        <View style={styles.noNotificationsIndicator}>
          <Icon
            name='notifications'
            size={75}
            color={Colors.MED_GRAY}/>
          <Text style={styles.noNotificationsLabel}>
            No notifications
          </Text>
        </View>
      );
    }
    else {
      return (
        <ListView
          initialListSize={notifications.length}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}/>
      );
    }
  },

  _renderRow: function(notification) {
    return (
      <NotificationListItem
        notification={notification}
        navigator={this.props.navigator}
        onLoadMoreNotifications={() => {
          notificationStore.fetchPage(this._onGetNextPageOfNotificationsCallback, true);
        }}/>
    );
  },

  _onGetNextPageOfNotificationsCallback: function(notifications, isNextPage) {
    var notificationsList = [];

    for (var i = 0; i < notifications.size; i++) {
      let notification = notifications.get(i);

      // this is needed to decide when to render the load more notifications button
      // I attempted to get the onEndReached prop for ListView to work but for some
      // reason it kept getting continuously called...
      // Idea: Referring to above, this may not be working due to the ScrollView in OverLayPage that is rendering this
      notification.isLastItem = isNextPage && i === notifications.size - 1;
      notificationsList.push(notifications.get(i));
    }

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(notificationsList)
    });
  }

});

module.exports = NotificationsList;
