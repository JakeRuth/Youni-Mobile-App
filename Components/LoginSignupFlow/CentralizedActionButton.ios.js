'use strict';

var React = require('react');
var ReactNative = require('react-native');
var PrettyTouchable = require('../Common/PrettyTouchable');
var Spinner = require('../Common/Spinner');

var {
  View,
  StyleSheet,
  Dimensions
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 44
  }
});

/*
 *
 * This component is an experiment.
 *
 * In our login/signup flow pages, the design warrants that there will always be a centeralized button
 * that is always in the same spot, for every page.  So the 'Sign in', and 'Next' buttons through the
 * sign up process will always be in the same spot.
 *
 * Current gotcha's: The initial page with only the Sign In & Create Account options does not make use of this.
 *
 */
var CentralizedActionButton = React.createClass({

  propTypes: {
    label: React.PropTypes.string.isRequired,
    onPress: React.PropTypes.func.isRequired,
    showSpinner: React.PropTypes.bool
  },

  render: function() {
    var content;

    if (this.props.showSpinner) {
      content = <Spinner color="white"/>;
    }
    else {
      content = (
        <PrettyTouchable
          {...this.props}
          containerStyle={{
            width: Dimensions.get('window').width * .8,
            height: 44
          }}
          invertColors={true}/>
      );
    }

    return (
      <View style={styles.container}>
        {content}
      </View>
    );
  }

});

module.exports = CentralizedActionButton;
