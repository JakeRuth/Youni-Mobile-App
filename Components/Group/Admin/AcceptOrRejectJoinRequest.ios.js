'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');

var {
  View,
  AlertIOS,
  StyleSheet,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  option: {
    flex: 1
  },
  acceptOption: {
    marginRight: -10
  },
  checkIcon: {
    textAlign: 'right'
  }
});

var AcceptOrRejectJoinRequest = React.createClass({

  propTypes: {
    onAcceptAction: React.PropTypes.func.isRequired,
    onRejectAction: React.PropTypes.func.isRequired
  },

  render: function() {
    return (
      <View style={styles.container}>
        <TouchableHighlight
          style={styles.option}
          underlayColor="transparent"
          onPress={this._promptAlertToDeny}>
          <View>
            <Icon
              name='clear'
              size={24}
              color='#F7002B'/>
          </View>
        </TouchableHighlight>

        <TouchableHighlight
          style={[styles.option, styles.acceptOption]}
          underlayColor="transparent"
          onPress={this._promptAlertToAccept}>
          <View>
            <Icon
              style={styles.checkIcon}
              name='check'
              size={24}
              color='#5C7CFF'/>
          </View>
        </TouchableHighlight>
      </View>
    );
  },

  _promptAlertToDeny: function() {
    AlertIOS.alert(
      'Are you sure you want to deny this request?',
      '',
      [
        {
          text: 'Yes',
          onPress: this.props.onRejectAction
        },
        {
          text: 'No'
        }
      ]
    );
  },

  _promptAlertToAccept: function() {
    AlertIOS.alert(
      'Are you sure you want to accept this request?',
      '',
      [
        {
          text: 'Yes',
          onPress: this.props.onAcceptAction
        },
        {
          text: 'No'
        }
      ]
    );
  }

});

module.exports = AcceptOrRejectJoinRequest;
