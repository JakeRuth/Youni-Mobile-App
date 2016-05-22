'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');

var searchStore = require('../../stores/SearchStore');
var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');

var {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  searchBarInputContainer: {
    padding: 7,
    position: 'relative'
  },
  searchBarInput: {
    height: 20
  },
  clearSearchButtonContainer: {
    position: 'absolute',
    right: 0,
    top: 0
  },
  clearSearch: {
    fontSize: 20,
    padding: 10,
    paddingTop: 5,
    color: '#ADADAD'
  }
});

var SearchBarInput = React.createClass({

  render: function() {
    var networkName = userLoginMetadataStore.getNetworkName(),
        clearSearchButton;

    if (!searchStore.getInExploreFeedView()) {
      clearSearchButton = this._renderClearSearchButton();
    }

    return (
      <View style={styles.searchBarInputContainer}>
        <TextInput
          style={styles.searchBarInput}
          value={searchStore.getSearchTerm()}
          placeholder={'Search ' + networkName}
          blurOnSubmit={true}
          onChangeText={(search) => {
            searchStore.setSearchTerm(search);
          }}
          onSubmitEditing={() => {
            var email = userLoginMetadataStore.getEmail();
            searchStore.executeSearch(email);
          }}
          keyboardType='web-search'/>
        {clearSearchButton}
      </View>
    );
  },

  _renderClearSearchButton: function() {
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
  },

  _onClearSearchPress: function() {
    searchStore.setSearchTerm('');
    searchStore.setInExploreFeedView(true);
  }

});

module.exports = SearchBarInput;
