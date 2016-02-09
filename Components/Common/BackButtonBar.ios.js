'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var Icon = require('react-native-vector-icons/Ionicons');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  backButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10
  },
  backButton: {
    fontSize: 20,
    color: '#0083D4',
    marginLeft: 10
  }
});

// DO NOT USE #Deprecated.  Use BackArrow instead
var BackButtonBar = React.createClass({

  propTypes: {
    buttonOnPress: React.PropTypes.func.isRequired
  },

  render: function() {
    return (
      <TouchableHighlight
        onPress={this.props.buttonOnPress}
        underlayColor='transparent'>

        <View style={styles.backButtonContainer}>
          <Icon name='ios-arrow-back' size={25} color='#0083D4' />
          <Text style={styles.backButton}>
            Back
          </Text>
        </View>

      </TouchableHighlight>
    );
  }

});

module.exports = BackButtonBar;
