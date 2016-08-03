'use strict';

var React = require('react-native');
var Emoji = require('../Common/Emoji');
var Colors = require('../../Utils/Common/Colors');
var TrendingFeedFilters = require('../../Utils/Enums/TrendingFeedFilters');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  // container: {
  //   flexDirection: 'row',
  //   borderWidth: 1,
  //   borderColor: Colors.getPrimaryAppColor(),
  //   borderRadius: 15,
  //   height: 30,
  //   marginRight: 16,
  //   marginLeft: 16,
  //   marginBottom: 5,
  //   marginTop: 5
  // },
  // filter: {
  //   flex: 1,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   margin: 1,
  //   borderRadius: 14
  // },
  // selectedFilter: {
  //   backgroundColor: Colors.getPrimaryAppColor()
  // },
  // filterLabel: {
  //   fontSize: 13,
  //   fontWeight: '100',
  //   color: Colors.getPrimaryAppColor()
  // },
  // selectedFilterLabel: {
  //   color: 'white'
  // }
});

// this is currently not being used as we re implement the trending feature, this may be deleted if it's not needed anymore
var TrendingPageFilter = React.createClass({

  propTypes: {
    selectedFeed: React.PropTypes.string.isRequired,
    changeFeedSelector: React.PropTypes.func.isRequired
  },


  render: function() {
    return (
      <View style={styles.container}>

        // {this._renderFeedSelector(TrendingFeedFilters.DAILY)}
        // {this._renderFeedSelector(TrendingFeedFilters.WEEKLY)}
        // {this._renderFeedSelector(TrendingFeedFilters.ALL_TIME)}

      </View>
    );
  },

  _renderFeedSelector: function(feed) {
    var textSelectedStyle = {},
        containerSelectedStyle = {};

    if (feed == this.props.selectedFeed) {
      textSelectedStyle = styles.selectedFilterLabel;
      containerSelectedStyle = styles.selectedFilter;
    }

    return (
      <TouchableHighlight
        style={[styles.filter, containerSelectedStyle]}
        underlayColor='transparent'
        onPress={() => {this.props.changeFeedSelector(feed);}}>
        <Text style={[styles.filterLabel, textSelectedStyle]}>
          {feed}
        </Text>
      </TouchableHighlight>
    );
  }

});

module.exports = TrendingPageFilter;
