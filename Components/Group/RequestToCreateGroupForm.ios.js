'use strict';

var React = require('react');
var ReactNative = require('react-native');

var PrettyTouchable = require('../Common/PrettyTouchable');
var Spinner = require('../Common/Spinner');

var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Text,
  TextInput,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingRight: 40,
    paddingLeft: 40
  },
  message: {
    marginBottom: 20
  },
  input: {
    color: Colors.DARK_GRAY,
    fontSize: 16,
    height: 44,
    paddingTop: 5,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 20,
    borderRadius: 4,
    borderWidth: 1
  },
  additionalInfoInput: {
    height: 100
  }
});

var RequestToCreateGroupForm = React.createClass({

  propTypes: {
    groupName: React.PropTypes.string.isRequired,
    inviteCode: React.PropTypes.string.isRequired,
    additionalInfo: React.PropTypes.string.isRequired,
    isRequestInFlight: React.PropTypes.bool,
    onGroupNameInputChange: React.PropTypes.func.isRequired,
    onInviteCodeInputChange: React.PropTypes.func.isRequired,
    onAdditionalInfoInputChange: React.PropTypes.func.isRequired,
    onSubmit: React.PropTypes.func.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  render: function () {
    var additionalInputStyles = {
      borderColor: Colors.getPrimaryAppColor()
    };

    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Please provide us with as much information as possible to help expedite the review process.
        </Text>
        <TextInput
          style={[styles.input, additionalInputStyles]}
          placeholder="Organization Name"
          placeholderColor={Colors.getPrimaryAppColor()}
          onChangeText={(text) => this.props.onGroupNameInputChange(text)}
          value={this.props.groupName}
          maxLength={50}/>
        <TextInput
          style={[styles.input, additionalInputStyles]}
          placeholder="Invite Code (Optional)"
          placeholderColor={Colors.getPrimaryAppColor()}
          onChangeText={(text) => this.props.onInviteCodeInputChange(text)}
          value={this.props.inviteCode}
          maxLength={50}/>
        <TextInput
          style={[styles.input, styles.additionalInfoInput, additionalInputStyles]}
          placeholder="Additional information that will help us verify your organization"
          placeholderColor={Colors.getPrimaryAppColor()}
          onChangeText={(text) => this.props.onAdditionalInfoInputChange(text)}
          value={this.props.additionalInfo}
          multiline={true}/>
        {this._renderSubmitButton()}
      </View>
    );
  },

  _renderSubmitButton: function() {
    if (this.props.isRequestInFlight) {
      return <Spinner/>;
    }
    else {
      return (
        <PrettyTouchable
          label="Submit"
          containerStyle={{
            height: 44
          }}
          onPress={this.props.onSubmit}/>
      );
    }
  }

});

module.exports = RequestToCreateGroupForm;
