'use strict';

var React = require('react');
var ReactNative = require('react-native');

var userLoginMetadataStore = require('../stores/UserLoginMetadataStore');
var Colors = require('../Utils/Common/Colors');
var AjaxUtils = require('../Utils/Common/AjaxUtils');

var {
  View,
  Image,
  Dimensions,
  TouchableHighlight,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 64
  },
  tutorialPopup: {
    flex: 1,
    width: Dimensions.get('window').width
  }
});

var InitialLoginTutorialPopup = React.createClass({

  getInitialState: function() {
    return {
      isVisible: false
    };
  },
  
  componentWillMount: function() {
    this.setState({
      isVisible: userLoginMetadataStore.getShouldShowTutorialPopup()
    })
  },

  render: function() {
    if (this.state.isVisible) {
      return (
        <TouchableHighlight
          style={styles.container}
          underlayColor="transparent"
          onPress={this._onPress}>
          <Image
            style={styles.tutorialPopup}
            source={require('../images/initialLoginAppTutorialPopup.png')}/>
        </TouchableHighlight>
      );
    }
    else {
      return <View/>;
    }
  },

  _onPress: function() {
    this.setState({
      isVisible: false
    });
    
    AjaxUtils.ajax(
      '/user/disableShowTutorialPopup',
      {
        userEmail: userLoginMetadataStore.getEmail()
      }
    );
  }
  
});

module.exports = InitialLoginTutorialPopup;
