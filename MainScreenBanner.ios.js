'use strict'

var React = require('react-native');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  headingWrapper: {
    flexDirection: 'column',
    marginTop: 20,
    marginRight: 2,
    marginLeft: 2
  },
  header: {
    fontSize: 25,
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 0,
    backgroundColor: 'transparent',
    color: '#007C9E'
  },
  subHeader: {
    marginTop: 0,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 5,
    backgroundColor: 'transparent',
    color: '#C7C7C7'
  }
});

var MainScreenBanner = React.createClass({

  propTypes: {
    title: React.PropTypes.string.isRequired,
    subTitle: React.PropTypes.string
  },

  render: function() {
    return (
      <View style={styles.headingWrapper}>
        <Text style={styles.header}>
          {this.props.title}
        </Text>
        <Text style={styles.subHeader}>
          {this.props.subTitle}
        </Text>
      </View>
    );
  }

});

module.exports = MainScreenBanner;
