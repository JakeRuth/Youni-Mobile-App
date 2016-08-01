'use strict';

var React = require('react-native');

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
    marginRight: 15,
    color: Colors.DARK_GRAY
  }
});

var TrendingListItem = React.createClass({

  propTypes: {
    ranking: React.PropTypes.number.isRequired
  },

  render: function() {
    return (
      <View style={styles.container}>

        <Text style={styles.ranking}>
          {this.props.ranking}
        </Text>

        {this.props.children}

      </View>
    );
  }

});

module.exports = TrendingListItem;
