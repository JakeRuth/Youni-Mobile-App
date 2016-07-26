'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');

var {
  View,
  TouchableHighlight,
  Text,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  trendingIcon: {
    marginRight: 5
  },
  label: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    color: 'white'
  },
  dropdownIcon: {
    marginTop: 5,
    marginLeft: 3
  }
});

var TrendingDropdownTrigger = React.createClass({

  propTypes: {
    selectedType: React.PropTypes.shape({
      label: React.PropTypes.string.isRequired,
      iconName: React.PropTypes.string.isRequired
    }).isRequired,
    onPress: React.PropTypes.func.isRequired,
    isDropdownVisible: React.PropTypes.bool
  },

  render: function() {
    return (
      <TouchableHighlight
        underlayColor='transparent'
        onPress={this.props.onPress}>

        <View style={styles.container}>
          <Icon
            style={styles.trendingIcon}
            name='podium'
            size={24}
            color='white'/>
          <Text style={styles.label}>
            {this.props.selectedType.label}
          </Text>
          <Icon
            style={styles.dropdownIcon}
            name={this._getArrowIconName()}
            size={20}
            color='white'/>
        </View>

      </TouchableHighlight>
    );
  },

  _getArrowIconName: function() {
    if (this.props.isDropdownVisible) {
      return 'android-arrow-dropup';
    }
    else {
      return 'android-arrow-dropdown';
    }
  }

});

module.exports = TrendingDropdownTrigger;
