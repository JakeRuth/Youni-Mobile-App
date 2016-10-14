'use strict';

var React = require('react');
var ReactNative = require('react-native');

var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Text,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  timeLabel: {
    color: Colors.DARK_GRAY,
    fontSize: 40,
    fontWeight: '300'
  }
});

var HOURS_IN_DAY = 24;
var MINUTES_IN_HOUR = 60;
var SECONDS_IN_MINUTE = 60;

var ChallengeCountdown = React.createClass({

  propTypes: {
    days: React.PropTypes.number,
    hours: React.PropTypes.number,
    minutes: React.PropTypes.number,
    seconds: React.PropTypes.number
  },

  componentDidMount: function() {
    this._startCountdownTimer();
  },

  // set props as state since they will change
  getInitialState: function() {
    return {
      hours: this.props.hours + (this.props.days * HOURS_IN_DAY),
      minutes: this.props.minutes,
      seconds: this.props.seconds
    };
  },

  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.timeLabel}>
          {this._getLabel()}
        </Text>
      </View>
    );
  },

  _getLabel: function() {
    if (this.state.hours > 0 || this.state.minutes > 0 || this.state.seconds > 0) {
      return `${this._getHours()}${this._getMinutes()}${this._getSeconds()}`;
    }
    else {
      return 'Finished!'
    }
  },

  _getHours: function() {
    if (this.state.hours > 0) {
      return `${this.state.hours}h `;
    }
    else {
      return '';
    }
  },

  _getMinutes: function() {
    if (this.state.minutes > 0 || this.state.hours > 0) {
      return `${this.state.minutes}m `;
    }
    else {
      return '';
    }
  },

  _getSeconds: function() {
    return `${this.state.seconds}s`;
  },

  _startCountdownTimer: function() {
    var timer;

    timer = setInterval(() => {
      // decrement seconds value every second
      if (this.state.seconds > 0) {
        this.setState({
          seconds: this.state.seconds - 1
        });
      }
      // if a minute has ticked away, reset seconds and decrement minutes
      else {
        // decrement the time, unless there is no time left
        if (this.state.hours > 0 || this.state.minutes > 0) {
          this.setState({
            seconds: SECONDS_IN_MINUTE - 1
          });

          if (this.state.minutes > 0) {
            this.setState({
              minutes: this.state.minutes - 1
            });
          }
          // if an hour has ticked away, reset the minutes and decrement the hours
          else {
            this.setState({
              minutes: MINUTES_IN_HOUR - 1,
              hours: this.state.hours - 1
            });
          }
        }
        else {
          clearInterval(timer);
        }
      }
    }, 1000); // every second
  }

});

module.exports = ChallengeCountdown;
