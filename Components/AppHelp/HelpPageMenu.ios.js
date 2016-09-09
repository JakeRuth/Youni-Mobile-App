'use strict';

var React = require('react');
var ReactNative = require('react-native');

var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Text,
  StyleSheet,
  ScrollView
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    height: 45,
    borderTopWidth: 1,
    borderTopColor: Colors.MED_GRAY
  },
  labelContainer: {
    position: 'relative'
  },
  label: {
    textAlign: 'center',
    width: 100,
    fontSize: 18,
    paddingLeft: 10,
    paddingRight: 10
  },
  selectedFilterUnderline: {
    position: 'absolute',
    bottom: -5,
    left: 32,
    width: 36,
    height: 2
  }
});

var HelpPageMenu = React.createClass({

  propTypes: {
    filters: React.PropTypes.array.isRequired,
    selectedFilter: React.PropTypes.string.isRequired,
    onFilterPress: React.PropTypes.func.isRequired
  },

  render: function() {
    var content = [];

    for (var i = 0; i < this.props.filters.length; i++) {
      content.push(this._renderMenuOption(this.props.filters[i], i));
    }

    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={{alignItems: 'center'}}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          automaticallyAdjustContentInsets={false}>
          {content}
        </ScrollView>
      </View>
    );
  },

  _renderMenuOption: function(filter, index) {
    return (
      <View style={styles.labelContainer}>
        <Text
          style={[styles.label, {color: Colors.getPrimaryAppColor()}]}
          onPress={() => this.props.onFilterPress(filter)}
          key={index}>
          {filter}
        </Text>
        {this.renderSelectedUnderline(filter)}
      </View>
    );
  },

  renderSelectedUnderline: function(filter) {
    if (filter === this.props.selectedFilter) {
      return (
        <View style={[styles.selectedFilterUnderline, {backgroundColor: Colors.getPrimaryAppColor()}]}/>
      );
    }
  }

});

module.exports = HelpPageMenu;
