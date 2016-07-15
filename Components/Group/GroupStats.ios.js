'use strict';

var React = require('react-native');

var GroupUsersPopup = require('../PopupPages/GroupUsersPopup');
var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  container: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 15,
    paddingBottom: 15
  },
  postStatContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  campusScoreStatContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  memberStatContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  statValue: {
    color: Colors.YOUNI_PRIMARY_PURPLE,
    fontSize: 18,
    fontWeight: '300',
    textAlign: 'center'
  },
  statLabel: {
    color: Colors.YOUNI_PRIMARY_PURPLE,
    fontSize: 11,
    fontWeight: '100',
    textAlign: 'center'
  },
  separator: {
    backgroundColor: Colors.LIGHT_GRAY,
    height: 36,
    width: 2
  }
});

var GroupStats = React.createClass({

  propTypes: {
    group: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired,
      description: React.PropTypes.string.isRequired,
      coverImageUrl: React.PropTypes.string.isRequired,
      badgeImageUrl: React.PropTypes.string.isRequired,
      adminEmails: React.PropTypes.array,
      allTimeTrendPoints: React.PropTypes.number.isRequired,
      numPosts: React.PropTypes.number.isRequired,
      numMembers: React.PropTypes.number.isRequired
    }).isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    return (
      <View style={styles.container}>

        {this._renderStat(styles.postStatContainer, this.props.group.numPosts, 'Posts')}
        {this._renderSeparator()}
        {this._renderStat(styles.campusScoreStatContainer, this.props.group.allTimeTrendPoints, 'Campus Score')}
        {this._renderSeparator()}
        {this._renderStat(styles.memberStatContainer, this.props.group.numMembers, 'Members', this._onMembersStatPress)}

      </View>
    );
  },
  
  _renderStat: function(containerStyle, value, label, onPressAction) {
    if (!onPressAction) {
      onPressAction = ()=>null;
    }

    return (
      <TouchableHighlight
        style={containerStyle}
        underlayColor="transparent"
        onPress={onPressAction}>

        <View>
          <Text style={styles.statValue}>
            {value}
          </Text>
          <Text style={styles.statLabel}>
            {label}
          </Text>
        </View>
        
      </TouchableHighlight>
    );
  },

  _renderSeparator: function() {
    return (
      <View style={styles.separator}/>
    )
  },

  _onMembersStatPress: function() {
    this.props.navigator.push({
      component: GroupUsersPopup,
      passProps: {
        groupIdString: this.props.group.id
      }
    })
  }

});

module.exports = GroupStats;
