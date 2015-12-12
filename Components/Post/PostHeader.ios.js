'use strict'

var React = require('react-native');
var DeletePostIcon = require('./DeletePostIcon');
var FlagPostIcon = require('./FlagPostIcon');

var {
  View,
  Text,
  Image,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    marginTop: 0
  },
  posterImage: {
    height: 45,
    width: 45,
    borderRadius: 22,
    marginRight: 10
  },
  posterName: {
    flex: 4,
    fontSize: 20
  },
  timestamp: {
    flex: 1,
    alignSelf: 'center',
    color: 'darkgray'
  }
});

var PostHeader = React.createClass({

  propTypes: {
    id: React.PropTypes.number.isRequired,
    postIdString: React.PropTypes.string.isRequired,
    posterProfileImageUrl: React.PropTypes.string,
    posterName: React.PropTypes.string.isRequired,
    timestamp: React.PropTypes.string.isRequired,
    viewerIsPostOwner: React.PropTypes.bool
  },

  render: function() {
    //TODO: Theres probably a better way to branch this logic, worth revisiting when we solve #techdebt
    var profileImageOrDeleteIcon = <View/>,
        flagPostIcon = <View/>;

    if (this.props.posterProfileImageUrl) {
      profileImageOrDeleteIcon = (
        <Image style={styles.posterImage} source={{uri: this.props.posterProfileImageUrl}} />
      );
    }

    if (this.props.viewerIsPostOwner) {
      profileImageOrDeleteIcon = (
        <DeletePostIcon
          id={this.props.id}
          postIdString={this.props.postIdString} />
      );
    }
    else {
      flagPostIcon = (
        <FlagPostIcon postId={this.props.postIdString}/>
      );
    }

    return (
      <View style={styles.postHeader}>

        {profileImageOrDeleteIcon}
        <Text style={styles.posterName} numberOfLines={1}>{this.props.posterName}</Text>
        {flagPostIcon}
        <Text style={styles.timestamp}>{this.props.timestamp}</Text>

      </View>
    );
  }

});

module.exports = PostHeader;
