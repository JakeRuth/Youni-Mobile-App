'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Unicycle = require('../../Unicycle');

var GroupThumbnailLink = require('./GroupThumbnailLink');
var Spinner = require('../Common/Spinner');

var exploreFeedOrgsStore = require('../../stores/group/ExploreFeedOrgsStore');
var Colors = require('../../Utils/Common/Colors');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');

var {
  View,
  Text,
  StyleSheet,
  ScrollView
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  title: {
    height: 30,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    padding: 5
  },
  seeAllTextTrigger: {
    position: 'absolute',
    top: 7,
    right: 10,
    fontSize: 16,
    color: Colors.MED_GRAY
  },
  groupThumbnailStyle: {
    paddingLeft: 3
  },
  groupImageStyle: {
    width: 80,
    height: 80,
    borderRadius: 14
  }
});

var MostRecentOrgs = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

  mixins: [
    Unicycle.listenTo(exploreFeedOrgsStore)
  ],

  componentDidMount: function() {
    exploreFeedOrgsStore.requestTenMostRecentOrgs();
  },

  render: function() {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, { color: Colors.getPrimaryAppColor() }]}>
          Recent Orgs
        </Text>

        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          automaticallyAdjustContentInsets={false}>
          {this._renderContent()}
        </ScrollView>

        <Text style={styles.seeAllTextTrigger}>
          See All
        </Text>
      </View>
    );
  },

  _renderContent: function() {
    if (exploreFeedOrgsStore.isGroupsOnExploreLoading()) {
      return <Spinner/>;
    }
    else {
      return this._renderGroups();
    }
  },

  _renderGroups: function() {
    var mostRecentGroups = exploreFeedOrgsStore.getGroupsOnExplorePage(),
        groupComponents = [];

    for (var i = 0; i < mostRecentGroups.length; i++) {
      groupComponents.push(
        <GroupThumbnailLink
          style={styles.groupThumbnailStyle}
          imageStyle={styles.groupImageStyle}
          group={mostRecentGroups[i]}
          navigator={this.props.navigator}
          key={i}/>
      );
    }

    return groupComponents;
  }

});

module.exports = MostRecentOrgs;
