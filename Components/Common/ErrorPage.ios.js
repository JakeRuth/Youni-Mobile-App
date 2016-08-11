'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  errorMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF7878'
  },
  errorMessageHeader: {
    fontSize: 30,
    textAlign: 'center',
    padding: 5
  },
  errorMessageSubHeader: {
    fontSize: 15,
    textAlign: 'center',
    padding: 5
  },
  errorMessageFooter: {
    marginTop: 50,
    fontSize: 8
  },
  reloadPageIcon: {
    padding: 20
  }
});

var ErrorPage = React.createClass({

  propTypes: {
    reloadButtonAction: React.PropTypes.func.isRequired,
    hideReloadButton: React.PropTypes.bool,
    subTitleMessageOverride: React.PropTypes.string
  },

  render: function() {
    return (
      <View style={styles.errorMessageContainer}>
        <Text style={styles.errorMessageHeader}>
          Tarter sauce!
        </Text>
        <Text style={styles.errorMessageSubHeader}>
          {this._getSubtitle()}
        </Text>
        {this._renderReloadPageIcon()}
        <Text style={styles.errorMessageFooter}>
          We are working around the clock to improve your experience. Please stick with
          Youni as we sort out some growing pain bugs as we build this app to the
          college social media app it is aspiring to be. -Thank you #ByStudentsForStudents
        </Text>
      </View>
    );
  },

  _getSubtitle: function() {
    if (this.props.subTitleMessageOverride) {
      return this.props.subTitleMessageOverride;
    }
    else {
      return 'Please try to reload the page, or reopen the app.';
    }
  },

  _renderReloadPageIcon: function() {
    if (!this.props.hideReloadButton) {
      return (
        <TouchableHighlight
          underlayColor='transparent'
          onPress={this.props.reloadButtonAction}>
          <Icon
            style={styles.reloadPageIcon}
            name='refresh'
            size={35}
            color={'gray'}/>
        </TouchableHighlight>
      );
    }
    else {
      return (
        <View/>
      );
    }
  }

});

module.exports = ErrorPage;
