'use strict';

var React = require('react-native');
var Colors = require('../../../Utils/Common/Colors');
var Gender = require('../../../Utils/Enums/Gender');
var signupStore = require('../../../stores/SignupStore');

var {
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    width: Dimensions.get('window').width *.8
  },
  selector: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    width: 120,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 100
  },
  selectorLabel: {
    fontSize: 16,
    fontWeight: '100',
    color: 'white'
  }
});

var GenderInput = React.createClass({

  getInitialState: function() {
    return {
      genderSelected: null
    };
  },

  render: function() {
    return (
      <View style={styles.container}>

        {this._renderOption(Gender.MALE, this._onMaleSelect)}
        <View style={{flex: 1}}/>
        {this._renderOption(Gender.FEMALE, this._onFemaleSelect)}

      </View>
    );
  },

  _renderOption: function(gender, onSelect) {
    var selectorStyles = [styles.selector],
        selectorLabelStyles = [styles.selectorLabel];

    if (this.state.genderSelected === gender) {
      selectorStyles.push({ backgroundColor: 'white' });
      selectorLabelStyles.push({ color: Colors.YOUNI_PRIMARY_PURPLE });
    }

    return (
      <TouchableOpacity
        style={selectorStyles}
        onPress={onSelect}
        underlayColor="transparent"
        activeOpacity={1}>
        <Text style={selectorLabelStyles}>
          {gender}
        </Text>
      </TouchableOpacity>
    );
  },

  _onMaleSelect: function() {
    this.setState({
      genderSelected: Gender.MALE
    });
    signupStore.setGender(Gender.MALE);
  },

  _onFemaleSelect: function() {
    this.setState({
      genderSelected: Gender.FEMALE
    });
    signupStore.setGender(Gender.FEMALE);
  }

});

module.exports = GenderInput;
