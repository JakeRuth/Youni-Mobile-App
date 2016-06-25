'use strict';

var React = require('react-native');
var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Text,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  value: {
    fontWeight: '300',
    color: 'white',
    fontSize: 16,
    textAlign: 'center'
  },
  label: {
    fontWeight: '100',
    color: 'white',
    fontSize: 12,
    textAlign: 'center'
  },
  indicator: {
    position: 'absolute',
    top: 16,
    borderWidth: .5,
    borderColor: 'white',
    width: 30
  }
});

var ProfileStat = React.createClass({

  propTypes: {
    value: React.PropTypes.any.isRequired,
    label: React.PropTypes.string.isRequired,
    alignIndicatorTo: React.PropTypes.oneOf(['right', 'left']).isRequired
  },

  render: function() {
    var indicatorStyles = [styles.indicator];

    if (this.props.alignIndicatorTo === 'right') {
      indicatorStyles.push({ right: -10 });
    }
    else {
      indicatorStyles.push({ left: -10 });
    }

    return (
      <View>
        <Text style={styles.value}>
          {this.props.value}
        </Text>
        <Text style={styles.label}>
          {this.props.label}
        </Text>
        <View style={indicatorStyles}/>
      </View>
    );
  }

});

module.exports = ProfileStat;
