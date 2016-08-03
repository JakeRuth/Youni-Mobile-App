'use strict';

var React = require('react-native');
var Swiper = require('react-native-swiper');

var Colors = require('../../Utils/Common/Colors');

var {
  View,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  swiperDot: {
    backgroundColor: Colors.YOUNI_PRIMARY,
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
      <View style={[styles.swiperDot]}/>
    );
  },

  _renderActiveSwiperDot: function() {
    return (
      <View style={[styles.swiperDot, styles.activeSwiperDot]}/>
    );
  }

});

module.exports = ProfileInfoSwiper;
