'use strict';

var React = require('react');
var ReactNative = require('react-native');

var GroupThumbnailLink = require('../Group/GroupThumbnailLink');

var createPostStore = require('../../stores/CreatePostStore');

var {
  View,
  StyleSheet,
  TouchableHighlight
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    marginRight: 7,
    marginBottom: 7
  }
});

var CreatePostGroupListItem = React.createClass({

  propTypes: {
    group: React.PropTypes.object.isRequired,
    size: React.PropTypes.number.isRequired
  },

  render: function() {
    let size = this.props.size - 7; // subtract the added margin

    return (
      <TouchableHighlight
        style={styles.container}
        underlayColor="transparent">

        <View style={{ opacity: this._getListItemOpacity() }}>
          <GroupThumbnailLink
            group={this.props.group}
            imageStyle={{
              height: size,
              width: size
            }}
            onPress={() => createPostStore.toggleGroupIdInList(this.props.group.id)}/>
        </View>

      </TouchableHighlight>
    );
  },
  
  _getListItemOpacity: function() {
    if (createPostStore.isGroupIdSelected(this.props.group.id)) {
      return 1;
    }
    else {
      return .5;
    }
  }

});

module.exports = CreatePostGroupListItem;
