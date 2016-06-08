'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');
var Color = require('../../../Utils/Common/Colors');

var {
  View,
  TouchableHighlight,
  StyleSheet
} = React

var styles = StyleSheet.create({
  actionButtonsContainer: {
    flexDirection: 'column'
  },
  submitButton: {
    flex: 1,
    alignSelf: 'center',
    marginLeft: 5
  },
  cancelButton: {
    flex: 1,
    marginTop: 5,
    alignSelf: 'center',
    marginLeft: 5
  }
});

var EditBioBox = React.createClass({

  propTypes: {
    onSubmitButtonPress: React.PropTypes.func.isRequired,
    onCancelButtonPress: React.PropTypes.func.isRequired
  },

  render: function() {
    return (
      <View style={styles.actionButtonsContainer}>
        <TouchableHighlight
          onPress={this.props.onSubmitButtonPress}
          underlayColor='transparent'>

          <Icon style={styles.submitButton}
            name='checkmark' size={30} color={Color.YOUNI_PRIMARY_PURPLE} />

        </TouchableHighlight>
        <TouchableHighlight
          onPress={this.props.onCancelButtonPress}
          underlayColor='transparent'>

          <Icon style={styles.cancelButton}
            name='close' size={30} color={'#FF7878'} />

        </TouchableHighlight>
      </View>
    );
  }

});

module.exports = EditBioBox;
