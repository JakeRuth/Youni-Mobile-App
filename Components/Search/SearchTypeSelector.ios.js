'use strict';

var React = require('react-native');

var searchStore = require('../../stores/SearchStore');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var SearchType = require('../../Utils/Enums/SearchType');
var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  container: {
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  selectorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'white'
  },
  selectedSelectorContainer: {
    borderBottomColor: Colors.YOUNI_PRIMARY
  },
  searchTypeSelector: {
    paddingBottom: 5,
    color: Colors.DARK_GRAY,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '100'
  },
  selectedSelector: {
    color: Colors.YOUNI_PRIMARY
  }
});

var SearchTypeSelector = React.createClass({
  
  render: function() {
    return (
      <View style={styles.container}>
        {this._renderLabel(SearchType.USER, 'Students')}
        {this._renderLabel(SearchType.GROUP, 'Organizations')}
      </View>
    );
  },

  _renderLabel: function(selectorType, label) {
    return (
      <TouchableHighlight
        style={this._getSelectorContainerStyles(selectorType)}
        underlayColor="transparent"
        onPress={() => {
          searchStore.executeSearch(userLoginMetadataStore.getEmail(), selectorType);
        }}>

        <Text style={this._getSelectorStyles(selectorType)}>
          {label}
        </Text>

      </TouchableHighlight>
    );
  },

  _getSelectorContainerStyles: function(selectorType) {
    if (searchStore.getSearchType() === selectorType) {
      return [styles.selectorContainer, styles.selectedSelectorContainer];
    }
    else {
      return styles.selectorContainer;
    }
  },

  _getSelectorStyles: function(selectorType) {
    if (searchStore.getSearchType() === selectorType) {
      return [styles.searchTypeSelector, styles.selectedSelector];
    }
    else {
      return styles.searchTypeSelector;
    }
  }

});

module.exports = SearchTypeSelector;
