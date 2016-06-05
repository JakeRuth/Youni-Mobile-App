'use strict';

var React = require('react-native');
var PrettyInput = require('../../Common/PrettyInput');
var GenderInput = require('./GenderInput');
var ClassYearInput = require('./ClassYearInput');
var signupStore = require('../../../stores/SignupStore');

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
  genderInputContainer: {
    marginBottom: 20
  },
  classYearInputContainer: {
    marginBottom: 20
  }
});

var SignupPartTwo = React.createClass({

  propTypes: {
    onClassYearInputPress: React.PropTypes.func.isRequired
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
            onTextChange={signupStore.setFirstName}
            placeholder='First Name'/>
        </View>

        <View style={styles.lastNameInputContainer}>
          <PrettyInput
            style={{
              width: Dimensions.get('window').width * .8,
              height: 44
            }}
            onTextChange={signupStore.setLastName}
            placeholder='Last Name'/>
        </View>

        <View style={styles.genderInputContainer}>
          <GenderInput/>
        </View>

        <View style={styles.classYearInputContainer}>
          <ClassYearInput
            onPress={this.props.onClassYearInputPress}
            value={signupStore.getClassYear()}/>
        </View>
      </View>
    );
  }

});

module.exports = SignupPartTwo;
