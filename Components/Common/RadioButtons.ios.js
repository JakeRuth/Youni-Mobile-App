'use strict';

var React = require('react-native');
var Unicycle = require('../../Unicycle');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} = React

var styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonLabel: {
    fontSize: 18,
    color: 'grey'
  },
  selectedButtonLabel: {
    color: 'white'
  },
  button: {
    height: 15,
    width: 15,
    marginLeft: 10,
    borderRadius: 7.5,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'grey'
  },
  selectedButton: {
    borderColor: 'white',
    backgroundColor: 'white'
  }
});

var RadioButtons = React.createClass({

  propTypes: {
    labels: React.PropTypes.array.isRequired,
    customOnButtonPress: React.PropTypes.func.isRequired
  },

  getInitialState: function() {
    return {
      selectedRadioButtonIndex: null
    };
  },

  render: function() {
    var buttons = [];
    for (var i = 0; i < this.props.labels.length; i++) {
      buttons.push(
        this.renderButton(this.props.labels[i], i)
      );
    }

    return (
      <View>
        {buttons}
      </View>
    );
  },

  renderButton: function(label, buttonIndex) {
    var isButtonSelected = this.state.selectedRadioButtonIndex === buttonIndex,
        buttonLabelStyles = [styles.buttonLabel],
        buttonStyles = [styles.button];

    if (isButtonSelected) {
        buttonLabelStyles.push(styles.selectedButtonLabel);
        buttonStyles.push(styles.selectedButton);
    }

    return(
      <TouchableHighlight
        key={buttonIndex}
        underlayColor={'transparent'}
        onPress={() => {this._onButtonPress(buttonIndex, label);}}>

        <View style={styles.buttonContainer}>
          <Text style={buttonLabelStyles}>
            {label}
          </Text>
          <View style={buttonStyles}/>
        </View>

      </TouchableHighlight>
    );
  },

  _onButtonPress: function(index, label) {
    this.setState({
      selectedRadioButtonIndex: index
    });
    this.props.customOnButtonPress(label);
  }

});

module.exports = RadioButtons;
