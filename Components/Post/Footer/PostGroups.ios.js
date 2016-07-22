'use strict';

var React = require('react-native');
var InvertibleScrollView = require('react-native-invertible-scroll-view');

var GroupThumbnailLink = require('../../Group/GroupThumbnailLink');

var {
  View
} = React;

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
          style={{ paddingLeft: 10 }}
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
