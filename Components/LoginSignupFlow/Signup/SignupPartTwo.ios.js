'use strict';

var React = require('react-native');
var PrettyInput = require('../../Common/PrettyInput');
var MaleFemaleInput = require('./MaleFemaleInput');
var ClassYearInput = require('./ClassYearInput');

var {
  View,
  StyleSheet,
  Dimensions
} = React;

var styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    width: Dimensions.get('window').width
  },
  firstNameInputContainer: {
    marginBottom: 20
  },
  lastNameInputContainer: {
    marginBottom: 20
  },
  maleFemaleInputContainer: {
    marginBottom: 20
  },
  classYearInputContainer: {
    marginBottom: 20
  }
});

var SignupPartTwo = React.createClass({

  propTypes: {
    onFirstNameInputChange: React.PropTypes.func.isRequired,
    onLastNameInputChange: React.PropTypes.func.isRequired,
    onMaleFemaleSelectionChange: React.PropTypes.func.isRequired,
    onClassYearInputPress: React.PropTypes.func.isRequired,
    selectedClassYearValue: React.PropTypes.string
  },

  render: function() {
    return (
      <View style={styles.container}>
        <View style={styles.firstNameInputContainer}>
          <PrettyInput
            style={{
              width: Dimensions.get('window').width * .8,
              height: 44
            }}
            onTextChange={this.props.onFirstNameInputChange}
            placeholder='First Name'/>
        </View>

        <View style={styles.lastNameInputContainer}>
          <PrettyInput
            style={{
              width: Dimensions.get('window').width * .8,
              height: 44
            }}
            onTextChange={this.props.onLastNameInputChange}
            placeholder='Last Name'/>
        </View>

        <View style={styles.maleFemaleInputContainer}>
          <MaleFemaleInput onChange={this.props.onMaleFemaleSelectionChange}/>
        </View>

        <View style={styles.classYearInputContainer}>
          <ClassYearInput
            onPress={this.props.onClassYearInputPress}
            value={this.props.selectedClassYearValue}/>
        </View>
      </View>
    );
  },

  onSignUpButtonPress: function() {
    if (this._assertAllFieldsAreNotBlank()) {
      this._alertMissingField();
    }
    else {
      this._createUser();
    }
  },

  _assertAllFieldsAreNotBlank: function() {
    var firstName = this.state.firstName,
        lastName = this.state.lastName,
        sex = this.state.sex;

    return (
      firstName.length === 0 ||
      lastName.length === 0 ||
      sex === null
    );
  },

  _alertMissingField: function() {
    AlertIOS.alert(
      'All fields must be filled',
      '',
      [
        {
          text: 'Ok'
        }
      ]
    );
  }

});

module.exports = SignupPartTwo;
