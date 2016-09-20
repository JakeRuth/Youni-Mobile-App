'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');

var RequestToCreateGroupPopup = require('../PopupPages/RequestToCreateGroupPopup');

var Colors = require('../../Utils/Common/Colors');

var {
  Text,
  View,
  TouchableHighlight,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 35
  },
  iconAndTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    marginRight: 8
  },
  label: {
    fontSize: 18
  }
});

var RequestToCreateGroup = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired,
    labelOverride: React.PropTypes.element
  },

  render: function() {
    return (
      <TouchableHighlight
        style={styles.container}
        underlayColor="transparent"
        onPress={() => this._onPress()}>
        {this.renderLabel()}
      </TouchableHighlight>
    );
  },

  renderLabel: function() {
    if (this.props.labelOverride) {
      return this.props.labelOverride;
    }
    else {
      return (
        <View style={styles.iconAndTextContainer}>
          <Icon
            style={styles.icon}
            name='add-circle-outline'
            size={23}
            color={Colors.getPrimaryAppColor()}/>
          <Text style={[styles.label, { color: Colors.getPrimaryAppColor() }]}>
            Request to Create Organization
          </Text>
        </View>
      );
    }
  },

  _onPress: function() {
    this.props.navigator.push({
      component: RequestToCreateGroupPopup
    });
  }

});

module.exports = RequestToCreateGroup;
