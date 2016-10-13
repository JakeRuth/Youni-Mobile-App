'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');
var Unicycle = require('../Unicycle');

var ShowImagePicker = require('./CreatePost/ShowImagePicker');
var Colors = require('../Utils/Common/Colors');
var BasePageIndex = require('../Utils/Enums/BasePageIndex');
var mainAppSwipePageStore = require('../stores/common/MainAppSwipePageStore');
var createPostStore = require('../stores/CreatePostStore');

var {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 35,
    width: Dimensions.get('window').width,
    backgroundColor: 'rgba(255, 255, 255, .8)'
  },
  navIconContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
    height: 24,
    borderRadius: 17
  },
  image: {
    height: 15,
    width: 15
  }
});

var BaseNavBar = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

  mixins: [
    Unicycle.listenTo(mainAppSwipePageStore)
  ],

  render: function() {
    return (
      <View style={styles.container}>
        <View style={styles.navIconContainer}>

          {this._renderIcon(BasePageIndex.FEED, 'home')}
          {this._renderIcon(BasePageIndex.EXPLORE, 'explore')}
          {this._renderIcon(BasePageIndex.CAMPUS_CHALLENGE, 'blur-on')}
          
          <Icon
            onPress={() => ShowImagePicker.showImagePicker(this.props.navigator)}
            name='photo-camera'
            size={34}
            color={Colors.MED_GRAY}/>

          {this._renderIcon(BasePageIndex.TRENDING, 'swap-vert')}
          
          <TouchableHighlight
            style={[styles.imageContainer, { backgroundColor: this._getColor(BasePageIndex.PROFILE) }]}
            underlayColor='transparent'
            onPress={() => mainAppSwipePageStore.navigatorTo(BasePageIndex.PROFILE)}>
            <Image
              style={styles.image}
              resizeMode="contain"
              source={require("../images/profileNavIcon.png")}/>
          </TouchableHighlight>

        </View>
      </View>
    );
  },

  _renderIcon: function(index, name) {
    return (
      <TouchableHighlight
        underlayColor='transparent'
        onPress={() => mainAppSwipePageStore.navigatorTo(index)}>
        <Icon
          name={name}
          size={26}
          color={this._getColor(index)}/>
      </TouchableHighlight>
    );
  },

  _getColor: function(index) {
    if (index === mainAppSwipePageStore.getCurrentPageIndex()) {
      return Colors.getPrimaryAppColor();
    }
    else {
      return Colors.MED_GRAY;
    }
  }

});

module.exports = BaseNavBar;
