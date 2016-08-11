'use strict';

var React = require('react');
var ReactNative = require('react-native');

var YouniHeader = require('./YouniHeader');
var BackArrow = require('./BackArrow');

var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  DeviceEventEmitter
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height
  },
  pageHeader: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center'
  }
});

var OverlayPage = React.createClass({

  componentDidMount() {
    DeviceEventEmitter.addListener('keyboardWillShow', () => {
      this.setState({isKeyboardVisible: true});
    });
    DeviceEventEmitter.addListener('keyboardWillHide', () => {
      this.setState({isKeyboardVisible: false});
    });
  },

  getInitialState: function () {
    return {
      isKeyboardVisible: this.props.isKeyboardVisible,
      bottomOfScrollViewPosition: null
    };
  },

  propTypes: {
    content: React.PropTypes.any.isRequired,
    onBackArrowPress: React.PropTypes.func.isRequired,
    bannerTitle: React.PropTypes.string,
    isKeyboardVisible: React.PropTypes.bool,
    bumpContentUpWhenKeyboardShows: React.PropTypes.bool,
    navigator: React.PropTypes.object
  },

  render: function () {
    var contentOffset = {x: 0, y: 0},
        hackyKeyboardPadding;

    if (this.props.bumpContentUpWhenKeyboardShows && this.state.isKeyboardVisible) {
      contentOffset = {
        x: 0,
        y: this._computePositionToScrollToWhenKeyboardDisplayed()
      };
      hackyKeyboardPadding = (
        <View
          style={{height: 250}}
          onLayout={(e) => {
            this.setState({
              bottomOfScrollViewPosition: e.nativeEvent.layout.y
            });
          }}/>
      );
    }

    return (
      <View style={styles.container}>
        <YouniHeader>
          <Text style={[styles.pageHeader, { color: Colors.getPrimaryAppColor() }]}>
            {this.props.bannerTitle}
          </Text>
          <BackArrow onPress={this.props.onBackArrowPress}/>
        </YouniHeader>

        <ScrollView
          contentOffset={contentOffset}
          automaticallyAdjustContentInsets={false}>

          {this.props.content}

          { /* This is a hacky way to compute the bottom of the scroll views position */ }
          {hackyKeyboardPadding}

        </ScrollView>
      </View>
    );
  },

  _computePositionToScrollToWhenKeyboardDisplayed: function () {
    var spaceBetweenTopOfScreenAndTopOfKeyboard = (Dimensions.get('window').height - 300);
    return this.state.bottomOfScrollViewPosition - spaceBetweenTopOfScreenAndTopOfKeyboard;
  }

});

module.exports = OverlayPage;
