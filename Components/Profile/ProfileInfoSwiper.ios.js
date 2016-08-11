'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Swiper = require('react-native-swiper');

var Colors = require('../../Utils/Common/Colors');

var {
  View,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
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

var ProfileInfoSwiper = React.createClass({

  render: function() {
    return (
      <Swiper
        height={190}
        loop={true}
        paginationStyle={{ bottom: 8 }}
        dot={this._renderSwiperDot()}
        activeDot={this._renderActiveSwiperDot()}>
        {this.props.children}
      </Swiper>
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

module.exports = ProfileInfoSwiper;
