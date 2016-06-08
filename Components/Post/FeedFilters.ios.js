'use strict';

var React = require('react-native');
var IonIcon = require('react-native-vector-icons/Ionicons');
var MaterialIcon = require('react-native-vector-icons/MaterialIcons');
var explorePostsStore = require('../../stores/post/ExplorePostsStore');
var ExploreFeedEndpoints = require('../../Utils/Enums/ExploreFeedEndpoints');
var Color = require('../../Utils/Common/Colors');

var {
  View,
  StyleSheet,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F2'
  },
  filterOptionContainer: {
    flex: 1,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 1,
    paddingBottom: 2
  },
  selectedFilterOption: {
    borderTopWidth: 1,
    borderTopColor: Color.YOUNI_PRIMARY_PURPLE,
    paddingTop: 0
  },
  icon: {
    flex: 1
  }
});

var FeedFilters = React.createClass({

  maleFilterName: 'male',
  femaleFilterName: 'female',
  defaultFilterName: 'both',

  selectedIconColor: Color.YOUNI_PRIMARY_PURPLE,
  defaultIconColor: '#ADADAD',

  propTypes: {
    disabled: React.PropTypes.bool
  },

  getInitialState: function() {
    return {
      selectedFilter: this.defaultFilterName
    };
  },

  render: function() {
    return (
      <View style={styles.container}>

        {this._renderFemaleOption()}
        {this._renderBothOption()}
        {this._renderMaleOption()}

      </View>
    );
  },

  _renderFemaleOption: function() {
    var filterStyles = [styles.filterOptionContainer],
        iconColor;

    if (this.state.selectedFilter === this.femaleFilterName) {
      filterStyles.push(styles.selectedFilterOption);
      iconColor = this.selectedIconColor;
    }
    else {
      iconColor = this.defaultIconColor;
    }

    return (
      <TouchableHighlight
        style={filterStyles}
        underlayColor={'transparent'}
        onPress={()=>{ this._onFilterPress(this.femaleFilterName); }}>

        <IonIcon
          style={styles.icon}
          name='woman'
          size={30}
          color={iconColor}/>

      </TouchableHighlight>
    );
  },

  _renderBothOption: function() {
    var filterStyles = [styles.filterOptionContainer],
        iconColor;

    if (this.state.selectedFilter === this.defaultFilterName) {
      filterStyles.push(styles.selectedFilterOption);
      iconColor = this.selectedIconColor;
    }
    else {
      iconColor = this.defaultIconColor;
    }

    return (
      <TouchableHighlight
        style={filterStyles}
        underlayColor={'transparent'}
        onPress={()=>{ this._onFilterPress(this.defaultFilterName); }}>

        <MaterialIcon
          style={styles.icon}
          name='wc'
          size={30}
          color={iconColor}/>

      </TouchableHighlight>
    );
  },

  _renderMaleOption: function() {
    var filterStyles = [styles.filterOptionContainer],
        iconColor;

    if (this.state.selectedFilter === this.maleFilterName) {
      filterStyles.push(styles.selectedFilterOption);
      iconColor = this.selectedIconColor;
    }
    else {
      iconColor = this.defaultIconColor;
    }

    return (
      <TouchableHighlight
        style={filterStyles}
        underlayColor={'transparent'}
        onPress={()=>{ this._onFilterPress(this.maleFilterName); }}>

        <IonIcon
          style={styles.icon}
          name='man'
          size={30}
          color={iconColor}/>

      </TouchableHighlight>
    );
  },

  _onFilterPress: function(selectedFilter) {
    if (!this.props.disabled) {
      explorePostsStore.setExploreFeedEndpoint(this._getExploreFeedEndpointForFilter(selectedFilter));
      this.setState({
        selectedFilter: selectedFilter
      });
    }
  },

  _getExploreFeedEndpointForFilter: function(selectedFilter) {
    if (selectedFilter === this.defaultFilterName) {
      return ExploreFeedEndpoints.DEFAULT;
    }

    if (selectedFilter === this.femaleFilterName) {
      return ExploreFeedEndpoints.FEMALE;
    }

    if (selectedFilter === this.maleFilterName) {
      return ExploreFeedEndpoints.MALE;
    }
  }

});

module.exports = FeedFilters;
