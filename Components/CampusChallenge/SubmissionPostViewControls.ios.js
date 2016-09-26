'use strict';

var React = require('react');
var ReactNative = require('react-native');
var Icon = require('react-native-vector-icons/MaterialIcons');

var Colors = require('../../Utils/Common/Colors');
var PostViewType = require('../../Utils/Enums/PostViewType');

var {
  View,
  TouchableHighlight,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    height: 38
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  postDisplayFormatLeftControl: {
    marginLeft: 30
  },
  postDisplayFormatRightControl: {
    marginRight: 30
  }
});

var SubmissionPostViewControls = React.createClass({

  propTypes: {
    currentPostViewMode: React.PropTypes.oneOf([PostViewType.GRID, PostViewType.LIST]).isRequired,
    onPostViewControlPress: React.PropTypes.func.isRequired
  },

  render: function() {
    var postGridIconColor, postListIconColor;

    if (this.props.currentPostViewMode === PostViewType.LIST) {
      postGridIconColor = Colors.MED_GRAY;
      postListIconColor = Colors.getPrimaryAppColor();
    }
    else {
      postGridIconColor = Colors.getPrimaryAppColor();
      postListIconColor = Colors.MED_GRAY;
    }

    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>

          <TouchableHighlight
            style={styles.postDisplayFormatLeftControl}
            underlayColor="transparent"
            onPress={() => this.props.onPostViewControlPress(PostViewType.LIST)}>
            <Icon
              name='menu'
              size={24}
              color={postListIconColor}/>
          </TouchableHighlight>

          <View style={{flex: 1}}>
            {this.props.children}
          </View>

          <TouchableHighlight
            style={styles.postDisplayFormatRightControl}
            underlayColor="transparent"
            onPress={() => this.props.onPostViewControlPress(PostViewType.GRID)}>
            <Icon
              name='apps'
              size={24}
              color={postGridIconColor}/>
          </TouchableHighlight>

        </View>
      </View>
    );
  }

});

module.exports = SubmissionPostViewControls;
