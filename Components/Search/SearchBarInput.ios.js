'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Unicycle = require('../../Unicycle');

var searchStore = require('../../stores/SearchStore');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var Colors = require('../../Utils/Common/Colors');
var SearchType = require('../../Utils/Enums/SearchType');

var {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  searchBarInputContainer: {
    borderRadius: 5,
    marginLeft: 10,
    marginRight: 10,
    padding: 7,
    position: 'relative',
    backgroundColor: 'white'
  },
  searchBarInput: {
    height: 18,
    color: Colors.DARK_GRAY,
    borderRadius: 5,
    fontSize: 16
  },
  searchIconContainer: {
    position: 'absolute',
    top: 6,
    left: 10
  },
  clearSearchButtonContainer: {
    position: 'absolute',
    right: 0,
    top: -3
  },
  clearSearch: {
    fontSize: 20,
    padding: 10,
    paddingTop: 5,
    color: Colors.MED_GRAY
  }
});

var SearchBarInput = React.createClass({

  render: function() {
    var networkName = userLoginMetadataStore.getNetworkName();

    return (
      <View style={styles.searchBarInputContainer}>
        <TextInput
          style={styles.searchBarInput}
          value={searchStore.getSearchTerm()}
          placeholder={'     Search ' + networkName}
          palceholderColor={Colors.MED_GRAY}
          blurOnSubmit={true}
          onChangeText={(search) => {
            searchStore.setSearchTerm(search);
          }}
          onSubmitEditing={() => {
            var email = userLoginMetadataStore.getEmail();
            searchStore.executeSearch(email);
          }}
          keyboardType='web-search'/>

        {this._renderClearSearchButton()}
        {this._renderSearchMagGlass()}

      </View>
    );
  },

  _renderSearchMagGlass: function () {
    if (searchStore.getSearchTerm().length === 0) {
      return (
        <View style={styles.searchIconContainer}>
          <Icon
            name='ios-search'
            size={18}
            color={Colors.MED_GRAY}/>
        </View>
      );
    }
  },

  _renderClearSearchButton: function() {
    if (!searchStore.getInExploreFeedView()) {
      return (
        <TouchableHighlight
          style={styles.clearSearchButtonContainer}
          underlayColor="transparent"
          onPress={this._onClearSearchPress}>
          <Text style={styles.clearSearch}>
            x
          </Text>
        </TouchableHighlight>
      );
    }
  },

  _onClearSearchPress: function() {
    searchStore.setSearchTerm('');
    searchStore.setInExploreFeedView(true);
  }

});

module.exports = SearchBarInput;
