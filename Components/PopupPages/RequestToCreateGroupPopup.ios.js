'use strict';

var React = require('react-native');

var RequestToCreateGroupForm = require('../Group/RequestToCreateGroupForm');
var YouniHeader = require('../Common/YouniHeader');
var BackArrow = require('../Common/BackArrow');

var userLoginMetaDataStore = require('../../stores/UserLoginMetadataStore');
var Colors = require('../../Utils/Common/Colors');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');

var {
  View,
  Text,
  StyleSheet,
  AlertIOS
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  pageHeader: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center'
  }
});

var RequestToCreateGroupPopup = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      groupName: '',
      additionalInfo: '',
      isRequestInFlight: false
    };
  },

  render: function () {
    return (
      <View style={styles.container}>
        <YouniHeader>
          <Text style={[styles.pageHeader, { color: Colors.getPrimaryAppColor() }]}>
            Request New Organization
          </Text>
          <BackArrow onPress={() => this.props.navigator.pop()}/>
        </YouniHeader>

        <RequestToCreateGroupForm
          groupName={this.state.groupName}
          additionalInfo={this.state.additionalInfo}
          isRequestInFlight={this.state.isRequestInFlight}
          onGroupNameInputChange={(text) => this.setState({ groupName: text })}
          onAdditionalInfoInputChange={(text) => this.setState({ additionalInfo: text })}
          onSubmit={this._onSubmitCreateGroupForm}
          navigator={this.props.navigator}/>

      </View>
    );
  },

  _onSubmitCreateGroupForm: function() {
    if (!this.state.groupName) {
      AlertIOS.alert(
        'Organization name cannot be blank',
        '',
        [
          {
            text: 'Ok'
          }
        ]
      );
    }
    else if (!this.state.additionalInfo) {
      AlertIOS.alert(
        'Additional information not provided',
        'Are you sure you want to submit this request with no additional information about your organization?',
        [
          {
            text: 'Yes',
            onPress: this._requestNewGroup
          },
          {
            text: 'No'
          }
        ]
      );
    }
    else {
      this._requestNewGroup();
    }
  },

  _requestNewGroup: function() {
    var that = this;

    this.setState({
      isRequestInFlight: true
    });

    AjaxUtils.ajax(
      '/group/userRequestToCreate',
      {
        requestingUserEmail: userLoginMetaDataStore.getEmail(),
        groupName: this.state.groupName,
        additionalInfo: this.state.additionalInfo
      },
      (res) => {
        that.setState({
          isRequestInFlight: false
        });
        that._alertSuccessfulRequest();
      },
      () => {
        that.setState({
          isRequestInFlight: false
        });
        that._alertFailedRequest();
      }
    );
  },

  _alertSuccessfulRequest: function() {
    AlertIOS.alert(
      'Success!',
      'We have received your request, we will send a response to the email associated with this account as soon' +
      'as we review the request!',
      [
        {
          text: 'Hurray!'
        }
      ]
    );
  },

  _alertFailedRequest: function() {
    AlertIOS.alert(
      'Request Failed',
      'Please try again.  If this problem persists please contact support@youniapp.com',
      [
        {
          text: 'Ok'
        }
      ]
    );
  }

});

module.exports = RequestToCreateGroupPopup;
