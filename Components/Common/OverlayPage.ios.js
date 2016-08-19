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
  Keyboard
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
    Keyboard.addListener('keyboardWillShow', () => {
      this.setState({isKeyboardVisible: true});
    });
    Keyboard.addListener('keyboardWillHide', () => {
      this.setState({isKeyboardVisible: false});
    });
  },

  getInitialState: function () {
    return {
      isKeyboardVisible: this.props.isKeyboardVisible
    };
  },

  propTypes: {
    content: React.PropTypes.any.isRequired,
    onBackArrowPress: React.PropTypes.func.isRequired,
    bannerTitle: React.PropTypes.string,
    isKeyboardVisible: React.PropTypes.bool,
    navigator: React.PropTypes.object
  },

  render: function () {
    var hackyKeyboardPadding;

    if (this.state.isKeyboardVisible) {
      hackyKeyboardPadding = (
        <View style={{height: 250}}/>
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
          keyboardShouldPersistTaps={true}
          automaticallyAdjustContentInsets={false}>

          {this.props.content}

          { /* This is a hacky way to compute the bottom of the scroll views position */ }
          {hackyKeyboardPadding}

        </ScrollView>
      </View>
    );
  }

});

module.exports = OverlayPage;
