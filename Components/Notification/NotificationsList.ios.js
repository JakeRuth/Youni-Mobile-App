'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var notificationStore = require('../../stores/NotificationStore');
var NotificationListItem = require('./NotificationListItem');

var {
  View,
  Text,
  ListView,
  StyleSheet,
  RecyclerViewBackedScrollView
} = React;

var styles = StyleSheet.create({
  loadMoreNotificationsButton: {
    position: 'absolute',
    backgroundColor: 'blue',
    bottom: 0
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
    var that = this;

    var waitUntilNotificationsLoad = setInterval(function() {
      if (!notificationStore.isRequestInFlight()) {
        that.setState({
          dataSource: that.state.dataSource.cloneWithRows(notificationStore.getFirstPage())
        });
        clearInterval(waitUntilNotificationsLoad);
        notificationStore.fetchPage(that._onGetNextPageOfNotificationsCallback)
      }
    }, 100);
  },

  mixins: [
    Unicycle.listenTo(notificationStore)
  ],

  render: function () {
    var notifications = notificationStore.getFirstPage(),
        that = this;

    return (
      <ListView
        initialListSize={notifications.length}
        dataSource={this.state.dataSource}
        renderRow={this._renderRow}
        renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}/>
    );
  },

  _renderRow: function(notification) {
    return (
      <NotificationListItem
        notification={notification}
        navigator={this.props.navigator}
        onLoadMoreNotifications={() => {
          notificationStore.fetchPage(this._onGetNextPageOfNotificationsCallback);
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
      notification.isLastItem = isNextPage && i === notifications.size - 1;
      notificationsList.push(notifications.get(i));
    }

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(notificationsList)
    });
  }

});

module.exports = NotificationsList;
