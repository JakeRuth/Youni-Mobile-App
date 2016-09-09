'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');

var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    height: 66
  },
  contactInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10
  },
  fullName: {
    flex: 1,
    fontSize: 16,
    alignSelf: 'center',
    color: Colors.DARK_GRAY
  }
});

var IOSPhoneContact = React.createClass({

  propTypes: {
    contact: React.PropTypes.shape({
      recordID: React.PropTypes.number.isRequired,
      familyName: React.PropTypes.string,
      givenName: React.PropTypes.string,
      middleName: React.PropTypes.string,
      emailAddresses: React.PropTypes.arrayOf(
        React.PropTypes.shape({
          label: React.PropTypes.string.isRequired,
          email: React.PropTypes.string.isRequired
        })
      ).isRequired,
      phoneNumbers: React.PropTypes.arrayOf(
        React.PropTypes.shape({
          label: React.PropTypes.string.isRequired,
          number: React.PropTypes.string.isRequired
        })
      ).isRequired,
      thumbnailPath: React.PropTypes.string
    }).isRequired,
    isSelected: React.PropTypes.bool,
    onPress: React.PropTypes.func.isRequired
  },

  render: function() {
    return (
      <TouchableHighlight
        style={styles.container}
        underlayColor='transparent'
        onPress={this.props.onPress}>

        <View style={styles.contactInfoContainer}>
          <Text
            style={styles.fullName}
            numberOfLines={1}>
            {this._getContactName()}
          </Text>
          {this._renderSelectedIndicator()}
        </View>

      </TouchableHighlight>
    );
  },
  
  _renderSelectedIndicator: function() {
    if (this.props.isSelected) {
      return (
        <Icon
          name='check-circle'
          size={22}
          color={Colors.getPrimaryAppColor()}/>
      );
    }
    else {
      return (
        <Icon
          name='radio-button-unchecked'
          size={22}
          color={Colors.getPrimaryAppColor()}/>
      );
    }
  },
  
  _getContactName: function() {
    var name = '';

    if (this.props.contact.givenName) {
      name += this.props.contact.givenName;
    }
    if (this.props.contact.middleName) {
      name += ` ${this.props.contact.middleName}`;
    }
    if (this.props.contact.familyName) {
      name += ` ${this.props.contact.familyName}`;
    }

    if (name.length === 0) {
      name = 'Contact has no name';
    }
    
    return name;
  }

});

module.exports = IOSPhoneContact;
