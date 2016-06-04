'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var PrettyTouchable = require('../../Common/PrettyTouchable');

var {
  View,
  StyleSheet,
  Dimensions,
  PickerIOS,
  PickerItemIOS
} = React;

var styles = StyleSheet.create({
  dropdownCaretContainer: {
    position: 'absolute',
    right: 10,
    top: 13
  },
  pickerContainer: {
    margin: 100
  }
});

var ClassYearInput = React.createClass({

  getInitialState: function() {
    return {
      showPicker: false,
      label: 'Class Year'
    };
  },

  render: function() {
    return (
      <View>
        <PrettyTouchable
          label={this.state.label}
          containerStyle={{
            width: Dimensions.get('window').width * .8,
            height: 44
          }}
          labelContainerStyle={{
            alignItems: 'flex-start'
          }}
          onPress={() => {
            this.setState({
              showPicker: true
            });
          }}/>

        {this._renderDropDownCaret()}
        {this._renderPicker()}
      </View>
    );
  },

  _renderDropDownCaret: function() {
    return (
      <View style={styles.dropdownCaretContainer}>
        <Icon
          name='android-arrow-dropdown'
          size={20}
          color='white'/>
      </View>
    )
  },

  // TODO: Think of how these values should be generated. Maybe from the API?
  _renderPicker: function() {
    var currentYear = new Date().getFullYear(),
        opt1 = currentYear.toString(),
        opt2 = (currentYear + 1).toString(),
        opt3 = (currentYear + 2).toString(),
        opt4 = (currentYear + 3).toString();
    
    if (this.state.showPicker) {
      return (
        <View style={styles.pickerContainer}>
          <PickerIOS
            selectedValue={null}
            onValueChange={(year) => {this._onPick(year)}}>
            <PickerItemIOS
              key={opt1}
              value={opt1}
              label={opt1}/>
            <PickerItemIOS
              key={opt2}
              value={opt2}
              label={opt2}/>
            <PickerItemIOS
              key={opt3}
              value={opt3}
              label={opt3}/>
            <PickerItemIOS
              key={opt4}
              value={opt4}
              label={opt4}/>
          </PickerIOS>
        </View>
      );
    }
    else {
      return <View/>;
    }
  },

  _onPick: function(year) {
    this.setState({
      label: year,
      showPicker: false
    })
  }

});

module.exports = ClassYearInput;
