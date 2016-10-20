'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Swiper = require('react-native-swiper');

var Colors = require('../../Utils/Common/Colors');

var {
  Text,
  View,
  StyleSheet,
  Dimensions
} = ReactNative;

var styles = StyleSheet.create({
  navButtonLabel: {
    fontSize: 40,
    textAlign: 'center'
  },
  swiperDot: {
    opacity: .5,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 9
  },
  activeSwiperDot: {
    opacity: 1
  }
});

// Currently deprecated and unused, may be able to be deleted in the future but I'll leave it around for now
var HelpPageSwiper = React.createClass({

  render: function() {
    return (
      <Swiper
        loop={false}
        height={Dimensions.get('window').height * .75}
        paginationStyle={{ bottom: -30 }}
        dot={this._renderSwiperDot()}
        activeDot={this._renderActiveSwiperDot()}
        showsButtons={true}
        nextButton={this._renderNavButton('›')}
        prevButton={this._renderNavButton('‹')}>
        {this.props.children}
      </Swiper>
    );
  },

  _renderNavButton: function(label) {
    return (
      <Text style={[styles.navButtonLabel, { color: Colors.getPrimaryAppColor() }]}>
        {label}
      </Text>
    );
  },

  _renderSwiperDot: function() {
    return (
      <View style={[styles.swiperDot, { backgroundColor: Colors.getPrimaryAppColor() }]}/>
    );
  },

  _renderActiveSwiperDot: function() {
    return (
      <View style={[styles.swiperDot, { backgroundColor: Colors.getPrimaryAppColor() }, styles.activeSwiperDot]}/>
    );
  }

});

module.exports = HelpPageSwiper;
