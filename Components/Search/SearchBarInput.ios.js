'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');

var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    padding: 7,
    position: 'relative',
    backgroundColor: 'white'
  },
  searchBarInput: {
    height: 18,
    color: Colors.DARK_GRAY,
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
  
  propTypes: {
    value: React.PropTypes.string,
    placeholder: React.PropTypes.string.isRequired,
    onChangeText: React.PropTypes.func.isRequired,
    onSubmitEditing: React.PropTypes.func,
    onClearSearchPress: React.PropTypes.func.isRequired,
    active: React.PropTypes.bool,
    alwaysShowClearButton: React.PropTypes.bool
  },

  render: function() {
    return (
      <View style={[styles.container, this.props.style]}>
        <TextInput
          {...this.props}
          style={styles.searchBarInput}
          palceholderColor={Colors.MED_GRAY}
          blurOnSubmit={true}
          keyboardType='web-search'/>

        {this._renderClearSearchButton()}
        {this._renderSearchMagGlass()}

      </View>
    );
  },

  _renderSearchMagGlass: function () {
    if (this.props.value.length === 0) {
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
    if (this.props.alwaysShowClearButton || this.props.active) {
      return (
        <TouchableHighlight
          style={styles.clearSearchButtonContainer}
          underlayColor="transparent"
          onPress={this.props.onClearSearchPress}>
          <Text style={styles.clearSearch}>
            x
          </Text>
        </TouchableHighlight>
      );
    }
  }

});

module.exports = SearchBarInput;
