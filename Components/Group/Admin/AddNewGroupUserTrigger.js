'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');

var Colors = require('../../../Utils/Common/Colors');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} = React;

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
    color: Colors.YOUNI_PRIMARY,
    fontSize: 18,
    fontWeight: '100'
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
            name='ios-plus-outline'
            size={20}
            color={Colors.YOUNI_PRIMARY}/>
          <Text style={styles.triggerLabel}>
            Add New Member
          </Text>
        </View>

      </TouchableHighlight>
    );
  }

});

module.exports = AddNewGroupUserTrigger;
