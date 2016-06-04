'use strict';

var React = require('react-native');
var PrettyTouchable = require('../Common/PrettyTouchable');

var {
  View,
  StyleSheet,
  Dimensions
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

/*
 *
 * This component is an experiment.
 *
 * In our login/signup flow pages, the design warrants that there will always be a centeralized button
 * that is always in the same spot, for every page.  So the 'Sign in', and 'Next' buttons through the
 * sign up process will always be in the same spot.  An easy way to notice this is that the centralized
 * button is the only one with inverted colors.
 *
 * Current gotcha's: The initial page with only the Sign In & Create Account options does not make use of this.
 *
 */
var CentralizedActionButton = React.createClass({

  propTypes: {
    label: React.PropTypes.string.isRequired,
    onPress: React.PropTypes.func.isRequired
  },

  render: function() {
    return (
      <View style={styles.container}>
        <PrettyTouchable
          label={this.props.label}
          containerStyle={{
            width: Dimensions.get('window').width * .8,
            height: 44
          }}
          invertColors={true}
          onPress={this.props.onPress}/>
      </View>
    );
  }

});

module.exports = CentralizedActionButton;
