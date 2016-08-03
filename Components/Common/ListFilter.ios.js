'use strict';

var React = require('react-native');

var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableHighlight
} = React;

var SELECTED_FILTER_UNDERLINE_WIDTH = 36;
var FILTER_CONTAINER_SCREEN_SIZE_RATIO = .8;

var styles = StyleSheet.create({
  container: {
    height: 35,
    justifyContent: 'center',
    alignItems: 'center'
  },
  filters: {
    flexDirection: 'row',
    width: Dimensions.get('window').width * FILTER_CONTAINER_SCREEN_SIZE_RATIO
  },
  filterLabelContainer: {
    flex: 1
  },
  filterLabel: {
    fontSize: 16,
    textAlign: 'center'
  },
  selectedFilterUnderline: {
    position: 'absolute',
    width: SELECTED_FILTER_UNDERLINE_WIDTH,
    height: 3,
    borderRadius: 1.5
  }
});

var ListFilter = React.createClass({

  propTypes: {
    filters: React.PropTypes.array.isRequired,
    selectedFilter: React.PropTypes.any.isRequired,
    onPress: React.PropTypes.func.isRequired
  },

  render: function() {
    var filters = [];
    
    for (var i = 0; i < this.props.filters.length; i++) {
      filters.push(this._renderFilterLabel(this.props.filters[i], i));
    }
    
    return (
      <View style={styles.container}>
        <View style={styles.filters}>
          {filters}
        </View>
      </View>
    );
  },

  _renderFilterLabel: function(filter, index) {
    return (
      <TouchableHighlight
        style={[styles.filterLabelContainer, { width: this._getFilterWidth() }]}
        underlayColor="transparent"
        onPress={() => this.props.onPress(filter)}
        key={index}>

        <View>
          <Text style={[styles.filterLabel, {color: Colors.getPrimaryAppColor()}]}>
            {filter}
          </Text>
          {this._renderSelectedFilterUnderline(filter)}
        </View>

      </TouchableHighlight>
    );
  },

  _renderSelectedFilterUnderline: function(filter) {
    if (this.props.selectedFilter === filter) {
      let style = {
        backgroundColor: Colors.getPrimaryAppColor(),
        left: (this._getFilterWidth() - SELECTED_FILTER_UNDERLINE_WIDTH) / 2
      };
      
      return (
        <View style={[styles.selectedFilterUnderline, style]}/>
      );
    }
  },

  _getFilterWidth: function() {
    return (Dimensions.get('window').width * FILTER_CONTAINER_SCREEN_SIZE_RATIO) / this.props.filters.length;
  }

});

module.exports = ListFilter;
