'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');
var Icon = require('react-native-vector-icons/Ionicons');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} = React

var styles = StyleSheet.create({
  backButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10
  },
  backButton: {
    fontSize: 15,
    color: '#007C9E',
    marginLeft: 10
  }
});

var BackButtonBar = React.createClass({

  propTypes: {
    buttonOnPress: React.PropTypes.func.isRequired
  },

  render: function() {
    return (
      <TouchableHighlight>
        <View style={styles.backButtonContainer}>
          <Icon name='ios-arrow-back' size={25} color='#007C9E' />
          <Text style={styles.backButton} onPress={this.props.buttonOnPress}>
            Back
          </Text>
        </View>
      </TouchableHighlight>
    );
  }

});

module.exports = BackButtonBar;
