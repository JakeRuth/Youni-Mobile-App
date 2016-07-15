'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');

var {
  View,
  StyleSheet,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingTop: 30,
    paddingRight: 12,
    paddingLeft: 30,
    paddingBottom: 15
  },
  iconContainer: {
    height: 30,
    width: 30,
    backgroundColor: 'rgba(0, 0, 0, .25)',
    paddingTop: 4,
    paddingLeft: 6,
    borderRadius: 15
  }
});

var GroupActionButton = React.createClass({

  render: function () {
    return (
      <TouchableHighlight
        style={styles.container}
        underlayColor='transparent'
        onPress={this._onButtonPress}>

        <View style={styles.iconContainer}>
          <Icon
            name='edit'
            size={22}
            color='white'/>
        </View>

      </TouchableHighlight>
    );
  },
  
  _onButtonPress: function() {
    
  }

});

module.exports = GroupActionButton;
