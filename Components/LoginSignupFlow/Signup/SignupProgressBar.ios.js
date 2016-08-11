'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Colors = require('../../../Utils/Common/Colors');

var {
  View,
  Dimensions,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: Dimensions.get('window').width * .8,
    marginTop: 40
  },
  stepSymbol: {
    width: 12,
    height: 12,
    borderRadius: 6,
    opacity: .5,
    backgroundColor: 'white'
  },
  filledStepSymbol: {
    opacity: 1
  },
  stepSymbolConnector: {
    flex: 1,
    height: 2,
    opacity: .5,
    backgroundColor: 'white'
  },
  filledStepSymbolConnector: {
    opacity: 1
  }
});

var SignupProgressBar = React.createClass({

  propTypes: {
    visible: React.PropTypes.bool,
    stepsCompleted: React.PropTypes.oneOf([1,2,3])
  },

  getDefaultProps: function() {
    return {
      visible: true,
      stepsCompleted: 1
    };
  },

  render: function() {
    if (!this.props.visible) {
      return <View/>;
    }

    if (this.props.stepsCompleted === 1) {
      return this._renderProgressBarStep1();
    }
    else if (this.props.stepsCompleted === 2) {
      return this._renderProgressBarStep2();
    }
    else {
      return this._renderProgressBarStep3();
    }
  },

  _renderProgressBarStep1: function() {
    return (
      <View style={styles.container}>

        <View style={[styles.stepSymbol, styles.filledStepSymbol]}/>
        <View style={styles.stepSymbolConnector}/>
        <View style={styles.stepSymbol}/>
        <View style={styles.stepSymbolConnector}/>
        <View style={styles.stepSymbol}/>

      </View>
    );
  },

  _renderProgressBarStep2: function() {
    return (
      <View style={styles.container}>

        <View style={[styles.stepSymbol, styles.filledStepSymbol]}/>
        <View style={[styles.stepSymbolConnector, styles.filledStepSymbolConnector]}/>
        <View style={[styles.stepSymbol, styles.filledStepSymbol]}/>
        <View style={styles.stepSymbolConnector}/>
        <View style={styles.stepSymbol}/>

      </View>
    );
  },

  _renderProgressBarStep3: function() {
    return (
      <View style={styles.container}>

        <View style={[styles.stepSymbol, styles.filledStepSymbol]}/>
        <View style={[styles.stepSymbolConnector, styles.filledStepSymbolConnector]}/>
        <View style={[styles.stepSymbol, styles.filledStepSymbol]}/>
        <View style={[styles.stepSymbolConnector, styles.filledStepSymbolConnector]}/>
        <View style={[styles.stepSymbol, styles.filledStepSymbol]}/>

      </View>
    );
  }

});

module.exports = SignupProgressBar;
