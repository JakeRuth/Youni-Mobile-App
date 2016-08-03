'use strict';

var React = require('react-native');
var InvertibleScrollView = require('react-native-invertible-scroll-view');

var GroupThumbnailLink = require('../../Group/GroupThumbnailLink');

var {
  View,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  groupThumbnailStyle: {
    paddingLeft: 10
  },
  groupImageStyle: {
    width: 38,
    height: 38,
    borderRadius: 8
  }
});

var PostGroups = React.createClass({

  propTypes: {
    groups: React.PropTypes.array,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    if (!this.props.groups || this.props.groups.length <= 0) {
      return <View/>;
    }
    
    let groups = [];

    for (var i = 0; i < this.props.groups.length; i++) {
      groups.push(
        <GroupThumbnailLink
          style={styles.groupThumbnailStyle}
          imageStyle={styles.groupImageStyle}
          group={this.props.groups[i]}
          navigator={this.props.navigator}
          key={i}/>
      );
    }

    return (
      <InvertibleScrollView
        style={this.props.style}
        inverted={true}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        automaticallyAdjustContentInsets={false}>
        {groups}
      </InvertibleScrollView>
    );
  }

});

module.exports = PostGroups;
