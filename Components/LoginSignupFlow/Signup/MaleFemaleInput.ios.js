'use strict';

var React = require('react-native');
var Colors = require('../../../Utils/Common/GlobalColorMap');
var GenderEnum = require('../../../Utils/Common/GenderEnum');

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

var MaleFemaleInput = React.createClass({

  propTypes: {
    onChange: React.PropTypes.func.isRequired
  },

  // need to states since they both start off unselected
  getInitialState: function() {
    return {
      genderSelected: null
    };
  },

  render: function() {
    return (
      <View style={styles.container}>

        {this._renderMaleOption()}
        <View style={{flex: 1}}/>
        {this._renderFemaleOption()}

      </View>
    );
  },

  _renderMaleOption: function() {
    var selectorStyles = [styles.selector],
        selectorLabelStyles = [styles.selectorLabel];

    if (this.state.genderSelected === GenderEnum.MALE) {
      selectorStyles.push({ backgroundColor: 'white' });
      selectorLabelStyles.push({ color: Colors.YOUNI_PRIMARY_PURPLE });
    }

    return (
      <TouchableOpacity
        style={selectorStyles}
        onPress={this._onMaleSelect}
        underlayColor="transparent"
        activeOpacity={1}>
        <Text style={selectorLabelStyles}>
          Male
        </Text>
      </TouchableOpacity>
    );
  },

  _renderFemaleOption: function() {
    var selectorStyles = [styles.selector],
        selectorLabelStyles = [styles.selectorLabel];

    if (this.state.genderSelected === GenderEnum.FEMALE) {
      selectorStyles.push({ backgroundColor: 'white' });
      selectorLabelStyles.push({ color: Colors.YOUNI_PRIMARY_PURPLE });
    }

    return (
      <TouchableOpacity
        style={selectorStyles}
        onPress={this._onFemaleSelect}
        underlayColor="transparent"
        activeOpacity={1}>
        <Text style={selectorLabelStyles}>
          Female
        </Text>
      </TouchableOpacity>
    );
  },

  _onMaleSelect: function() {
    this.setState({
      genderSelected: GenderEnum.MALE
    });
    this.props.onChange(GenderEnum.MALE);
  },

  _onFemaleSelect: function() {
    this.setState({
      genderSelected: GenderEnum.FEMALE
    });
    this.props.onChange(GenderEnum.FEMALE);
  }

});

module.exports = MaleFemaleInput;
