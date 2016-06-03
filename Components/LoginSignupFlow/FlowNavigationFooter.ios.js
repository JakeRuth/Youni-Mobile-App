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
    alignItems: 'center',
    position: 'absolute',
    bottom: 40,
    width: Dimensions.get('window').width
  },
  heading: {
    textAlign: 'center',
    fontSize: 14,
    color: 'white',
    fontWeight: '100',
    marginBottom: 14
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
        <Text style={styles.heading}>
          {this.props.heading}
        </Text>
        <PrettyTouchable
          label={this.props.navButtonLabel}
          containerStyle={{
            width: Dimensions.get('window').width * .8,
            height: 44
          }}
          onPress={this.props.navButtonAction}/>
      </View>
    );
  }

});

module.exports = FlowNavigationFooter;
