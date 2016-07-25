'use strict';

var React = require('react-native');

var GroupStats = require('./GroupStats');

var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Image,
  Text,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  coverImage: {
    flex: 1,
    height: 125
  },
  name: {
    color: Colors.DARK_GRAY,
    textAlign: 'center',
    fontWeight: '300',
    fontSize: 17,
    paddingTop: 10
  },
  description: {
    color: Colors.DARK_GRAY,
    fontWeight: '200',
    fontSize: 12,
    padding: 20,
    paddingTop: 2
  }
});

var GroupInfo = React.createClass({

  propTypes: {
    group: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired,
      abbreviatedName: React.PropTypes.string.isRequired,
      description: React.PropTypes.string.isRequired,
      coverImageUrl: React.PropTypes.string.isRequired,
      badgeImageUrl: React.PropTypes.string.isRequired,
      adminEmails: React.PropTypes.array,
      allTimeTrendPoints: React.PropTypes.number.isRequired,
      numPosts: React.PropTypes.number.isRequired,
      numMembers: React.PropTypes.number.isRequired
    }).isRequired
  },

  render: function() {
    return (
      <View style={styles.container}>

        <Image
          style={styles.coverImage}
          resizeMode="cover"
          source={{uri: this.props.group.coverImageUrl}}/>

        <Text style={styles.name}>
          {this.props.group.name}
        </Text>
        <Text style={styles.description}>
          {this.props.group.description}
        </Text>

        <GroupStats {...this.props}/>

      </View>
    );
  }

});

module.exports = GroupInfo;
