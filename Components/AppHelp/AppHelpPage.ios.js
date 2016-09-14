'use strict';

var React = require('react');
var ReactNative = require('react-native');

var HelpPageMenu = require('./HelpPageMenu');
var HelpPageSwiper = require('./HelpPageSwiper');
var YouniHeader = require('../Common/YouniHeader');
var BackArrow = require('../Common/BackArrow');

var Colors = require('../../Utils/Common/Colors');
var HelpMenuOptions = require('../../Utils/Enums/HelpMenuOptions');

var {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  pageHeader: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center'
  },
  dismissPageButton: {
    fontSize: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    paddingTop: 32,
    paddingLeft: 12,
    paddingRight: 30,
    paddingBottom: 15
  },
  helpImage: {
    flex: 1,
    alignSelf: 'center',
    width: Dimensions.get('window').width * .8
  }
});

var AppHelpPage = React.createClass({

  propTypes: {
    onClosePress: React.PropTypes.func.isRequired,
    showDismissButton: React.PropTypes.bool
  },

  getInitialState: function() {
    return {
      selectedFilter: HelpMenuOptions.CAMPUS
    };
  },

  render: function () {
    return (
      <View style={styles.container}>
        <YouniHeader>
          <Text style={[styles.pageHeader, { color: Colors.getPrimaryAppColor() }]}>
            Help Center
          </Text>
          {this._renderCloseButton()}
        </YouniHeader>

        <HelpPageMenu
          filters={[HelpMenuOptions.CAMPUS, HelpMenuOptions.MY_FEED, HelpMenuOptions.PROFILE,
          HelpMenuOptions.POSTING, HelpMenuOptions.TRENDING, HelpMenuOptions.MANAGE_GROUP]}
          selectedFilter={this.state.selectedFilter}
          onFilterPress={(filter) => this.setState({ selectedFilter: filter })}/>
        
        {this._renderHelpPagesForCurrentFilter()}
      </View>
    );
  },

  _renderCloseButton: function() {
    if (this.props.showDismissButton) {
      return (
        <Text
          style={[styles.dismissPageButton, { color: Colors.getPrimaryAppColor() }]}
          onPress={this.props.onClosePress}>
          Dismiss
        </Text>
      );
    }
    else {
      return <BackArrow onPress={() => this.props.navigator.pop()}/>;
    }
  },
  
  _renderHelpPagesForCurrentFilter: function() {
    if (this.state.selectedFilter === HelpMenuOptions.CAMPUS) {
      return this._renderHelpImages(this.campusImageSet);
    }
    else if (this.state.selectedFilter === HelpMenuOptions.MY_FEED) {
      return this._renderHelpImages(this.myFeedImageSet);
    }
    else if (this.state.selectedFilter === HelpMenuOptions.PROFILE) {
      return this._renderHelpImages(this.profileImageSet);
    }
    else if (this.state.selectedFilter === HelpMenuOptions.POSTING) {
      return this._renderHelpImages(this.postingImageSet);
    }
    else if (this.state.selectedFilter === HelpMenuOptions.TRENDING) {
      return this._renderHelpImages(this.trendingImageSet);
    }
    else if (this.state.selectedFilter === HelpMenuOptions.MANAGE_GROUP) {
      return this._renderHelpImages(this.manageGroupImageSet);
    }
  },

  _renderHelpImages: function(imageSet) {
    var images = [];

    for (var i = 0; i < imageSet.length; i++) {
      images.push(
        <Image
          style={styles.helpImage}
          resizeMode="contain"
          source={{uri: imageSet[i]}}/>
      );
    }

    return (
      <View style={{flex: 1, width: Dimensions.get('window').width}}>
        <HelpPageSwiper>
          {images}
        </HelpPageSwiper>
      </View>
    );
  },

  campusImageSet: [
    'https://s3.amazonaws.com/help-screens/home1.png',
    'https://s3.amazonaws.com/help-screens/home2.png',
    'https://s3.amazonaws.com/help-screens/home3.png',
    'https://s3.amazonaws.com/help-screens/home4.png',
    'https://s3.amazonaws.com/help-screens/home5.png',
    'https://s3.amazonaws.com/help-screens/home6.png'
  ],

  myFeedImageSet: [
    'https://s3.amazonaws.com/help-screens/campus1.png',
    'https://s3.amazonaws.com/help-screens/campus2.png',
    'https://s3.amazonaws.com/help-screens/campus3.png',
    'https://s3.amazonaws.com/help-screens/campus4.png',
    'https://s3.amazonaws.com/help-screens/campus5.png'
  ],

  profileImageSet: [
    'https://s3.amazonaws.com/help-screens/profile1.png',
    'https://s3.amazonaws.com/help-screens/profile2.png',
    'https://s3.amazonaws.com/help-screens/profile3.png',
    'https://s3.amazonaws.com/help-screens/profile4.png',
    'https://s3.amazonaws.com/help-screens/profile5.png',
    'https://s3.amazonaws.com/help-screens/profile6.png',
    'https://s3.amazonaws.com/help-screens/profile7.png',
    'https://s3.amazonaws.com/help-screens/profile8.png'
  ],

  postingImageSet: [
    'https://s3.amazonaws.com/help-screens/caption1.png',
    'https://s3.amazonaws.com/help-screens/caption2.png',
    'https://s3.amazonaws.com/help-screens/caption3.png'
  ],

  trendingImageSet: [
    'https://s3.amazonaws.com/help-screens/trending1.png',
    'https://s3.amazonaws.com/help-screens/trending2.png',
    'https://s3.amazonaws.com/help-screens/trending3.png',
    'https://s3.amazonaws.com/help-screens/trending4.png',
    'https://s3.amazonaws.com/help-screens/trending5.png'
  ],

  manageGroupImageSet: [
    'https://s3.amazonaws.com/help-screens/manage1.png',
    'https://s3.amazonaws.com/help-screens/manage2.png',
    'https://s3.amazonaws.com/help-screens/manage3.png',
    'https://s3.amazonaws.com/help-screens/manage4.png'
  ]

});

module.exports = AppHelpPage;
