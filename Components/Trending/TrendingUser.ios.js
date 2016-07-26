'use strict';

var React = require('react-native');

var UserListItem = require('../Common/UserListItem');

var trendingStore = require('../../stores/trending/TrendingStore');
var Colors = require('../../Utils/Common/Colors');

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
  ranking: {
    alignSelf: 'center',
    fontSize: 14,
    fontWeight: '100',
    margin: 15,
    color: Colors.DARK_GRAY
  }
});

var TrendingUser = React.createClass({

  propTypes: {
    ranking: React.PropTypes.number.isRequired,
    user: React.PropTypes.object.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    return (
      <View style={styles.container}>

        <Text style={styles.ranking}>
          {this.props.ranking}
        </Text>

        <UserListItem {...this.props}/>

      </View>
    );
  }

});

module.exports = TrendingUser;
