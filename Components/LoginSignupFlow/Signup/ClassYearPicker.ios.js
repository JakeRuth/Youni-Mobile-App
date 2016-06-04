'use strict';

var React = require('react-native');

var {
  StyleSheet,
  PickerIOS,
  PickerItemIOS,
  Dimensions
} = React;

var styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    backgroundColor: 'white'
  }
});

var ClassYearPicker = React.createClass({

  FRESHMAN: 'Freshman',
  SOPHOMORE: 'Sophomore',
  JUNIOR: 'Junior',
  SENIOR: 'Senior',
  GRADUATE: 'Graduate',

  propTypes: {
    onPick: React.PropTypes.func.isRequired
  },

  render: function() {
    return (
      <PickerIOS
        style={styles.container}
        selectedValue={this.JUNIOR}
        onValueChange={(year) => {this.props.onPick(year)}}>
        {this._renderPickerItem(this.FRESHMAN)}
        {this._renderPickerItem(this.SOPHOMORE)}
        {this._renderPickerItem(this.JUNIOR)}
        {this._renderPickerItem(this.SENIOR)}
        {this._renderPickerItem(this.GRADUATE)}
      </PickerIOS>
    );
  },

  _renderPickerItem: function(label) {
    return (
      <PickerItemIOS
        key={label}
        value={label}
        label={label}/>
    );
  }

});

module.exports = ClassYearPicker;
