'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');

var Colors = require('../../../Utils/Common/Colors');

var {
  View,
  Text,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  sectionHeaderContainer: {
    backgroundColor: Colors.WHITE_SMOKE,
    height: 32,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  sectionHeader: {
    marginLeft: 24,
    color: Colors.MED_GRAY,
    fontSize: 14,
    fontWeight: '100',
    textAlign: 'left'
  },
  sectionContainer: {
    paddingLeft: 24,
    paddingRight: 24
  }
});

var ManageGroupUsersSection = React.createClass({

  propTypes: {
    heading: React.PropTypes.string.isRequired
  },

  render: function() {
    return (
      <View>

        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionHeader}>
            {this.props.heading}
          </Text>
        </View>

        <View style={styles.sectionContainer}>
          {this.props.children}
        </View>

      </View>
    );
  }

});

module.exports = ManageGroupUsersSection;
