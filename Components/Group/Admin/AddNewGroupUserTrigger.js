'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');

var Colors = require('../../../Utils/Common/Colors');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    height: 44
  },
  triggerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  triggerIcon: {
    marginTop: 2.5,
    marginRight: 8
  },
  triggerLabel: {
    fontSize: 18
  }
});

var AddNewGroupUserTrigger = React.createClass({

  propTypes: {
    onPress: React.PropTypes.func.isRequired
  },

  render: function() {
    return (
      <TouchableHighlight
        style={styles.container}
        underlayColor="transparent"
        onPress={this.props.onPress}>
        
        <View style={styles.triggerContainer}>
          <Icon
            style={styles.triggerIcon}
            name='add-circle-outline'
            size={20}
            color={Colors.getPrimaryAppColor()}/>
          <Text style={[styles.triggerLabel, { color: Colors.getPrimaryAppColor() }]}>
            Add New Member
          </Text>
        </View>

      </TouchableHighlight>
    );
  }

});

module.exports = AddNewGroupUserTrigger;
