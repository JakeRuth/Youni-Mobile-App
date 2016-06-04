var React = require('react-native');
var PrettyTouchable = require('../Common/PrettyTouchable');

var {
  View,
  Text,
  StyleSheet,
  Dimensions
} = React;

var styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    width: Dimensions.get('window').width
  },
  label: {
    textAlign: 'center',
    fontSize: 14,
    color: 'white',
    fontWeight: '100'
  },
  clickableLabel: {
    textDecorationLine: 'underline',
    paddingTop: 10,
    paddingBottom: 10
  }
});

var FlowNavigationFooter = React.createClass({

  propTypes: {
    heading: React.PropTypes.string.isRequired,
    navButtonLabel: React.PropTypes.string.isRequired,
    navButtonAction: React.PropTypes.func.isRequired
  },

  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>
          {this.props.heading + ' '}
          <Text
            style={styles.clickableLabel}
            onPress={this.props.navButtonAction}>
            {this.props.navButtonLabel}
          </Text>
        </Text>
      </View>
    );
  }

});

module.exports = FlowNavigationFooter;
