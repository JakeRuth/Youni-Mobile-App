'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');

var TrendingFeedType = require('../../Utils/Enums/TrendingFeedType');

var trendingStore = require('../../stores/trending/TrendingStore');
var Colors = require('../../Utils/Common/Colors');

var {
  View,
  TouchableHighlight,
  Text,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    borderRadius: 4
  },
  dropdownListItem: {
    flex: 1,
    flexDirection: 'row',
    height: 57,
    width: 185,
    alignItems: 'center',
    justifyContent: 'center'
  },
  label: {
    marginLeft: 8,
    color: 'white',
    fontSize: 17
  },
  separator: {
    height: 1,
    backgroundColor: Colors.WHITE_SMOKE,
    opacity: .5
  },
  icon: {
    marginTop: 4
  }
});

// NO LONGER IN USE
// DEPRECATED
var TrendingFeedDropdownType = React.createClass({
  
  propTypes: {
    onPress: React.PropTypes.func.isRequired
  },

  render: function() {
    return (
      <View style={[styles.container, { backgroundColor: Colors.getPrimaryAppColor() }, this.props.style]}>
        {this._renderDropdownListItem(TrendingFeedType.STUDENTS)}
        <View style={styles.separator}/>
        {this._renderDropdownListItem(TrendingFeedType.ORGANIZATIONS)}
      </View>
    );
  },

  _renderDropdownListItem: function(type) {
    return (
      <TouchableHighlight
        underlayColor={Colors.getPrimaryAppColor()}
        onPress={() => this._onPress(type)}>
        
        <View style={styles.dropdownListItem}>
          <Icon
            style={styles.icon}
            name={type.iconName}
            size={25}
            color='white'/>
          <Text style={styles.label}>
            {type.label}
          </Text>
        </View>
        
      </TouchableHighlight>
    );
  },
  
  _onPress: function(type) {
    trendingStore.setSelectedType(type);
    this.props.onPress();
  }

});

module.exports = TrendingFeedDropdownType;
