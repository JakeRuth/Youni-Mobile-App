var React = require('react-native');

var {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: Dimensions.get('window').width,
    position: 'absolute',
    bottom: 0
  },
  buttonContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'white',
    margin: 2
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    padding: 7,
    fontSize: 25,
    fontWeight: '200'
  }
});

var LoginSignupSelector = React.createClass({

  propTypes: {
    onLoginPress: React.PropTypes.func.isRequired,
    onSignupPress: React.PropTypes.func.isRequired
  },

  render: function() {
    return (
      <View style={styles.container}>
        <TouchableHighlight
          style={styles.buttonContainer}
          underlayColor="transparent"
          onPress={this.props.onLoginPress}>

          <Text style={styles.buttonText}>
            Login
          </Text>

        </TouchableHighlight>
        <TouchableHighlight
          style={styles.buttonContainer}
          underlayColor="transparent"
          onPress={this.props.onSignupPress}>

          <Text style={styles.buttonText}>
            Sign Up
          </Text>

        </TouchableHighlight>
      </View>
    );
  }

});

module.exports = LoginSignupSelector;
