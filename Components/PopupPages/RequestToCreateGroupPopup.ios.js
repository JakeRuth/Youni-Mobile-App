'use strict';

var React = require('react');
var ReactNative = require('react-native');
var DismissKeyboard = require('dismissKeyboard');

var RequestToCreateGroupForm = require('../Group/RequestToCreateGroupForm');
var YouniHeader = require('../Common/YouniHeader');
var BackArrow = require('../Common/BackArrow');

var userLoginMetaDataStore = require('../../stores/UserLoginMetadataStore');
var Colors = require('../../Utils/Common/Colors');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');

var {
  View,
  ScrollView,
  Text,
  StyleSheet,
  AlertIOS,
  Keyboard,
  TouchableWithoutFeedback
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
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
      inviteCode: '',
      additionalInfo: '',
      isRequestInFlight: false,
      isKeyboardVisible: null
    };
  },

  componentDidMount() {
    Keyboard.addListener('keyboardWillShow', () => {
      this.setState({isKeyboardVisible: true});
    });
    Keyboard.addListener('keyboardWillHide', () => {
      this.setState({isKeyboardVisible: false});
    });
  },

  render: function () {
    var hackyKeyboardPadding;

    if (this.state.isKeyboardVisible) {
      hackyKeyboardPadding = <View style={{ height: 270 }}/>;
    }

    return (
      <TouchableWithoutFeedback
        style={styles.container}
        onPress={() => DismissKeyboard()}>
        <ScrollView automaticallyAdjustContentInsets={false}>
          
          <YouniHeader>
            <Text style={[styles.pageHeader, { color: Colors.getPrimaryAppColor() }]}>
              Request New Organization
            </Text>
            <BackArrow onPress={() => this.props.navigator.pop()}/>
          </YouniHeader>

          <RequestToCreateGroupForm
            groupName={this.state.groupName}
            inviteCode={this.state.inviteCode}
            additionalInfo={this.state.additionalInfo}
            isRequestInFlight={this.state.isRequestInFlight}
            onGroupNameInputChange={(text) => this.setState({ groupName: text })}
            onInviteCodeInputChange={(text) => this.setState({ inviteCode: text })}
            onAdditionalInfoInputChange={(text) => this.setState({ additionalInfo: text })}
            onSubmit={this._onSubmitCreateGroupForm}
            navigator={this.props.navigator}/>

          {hackyKeyboardPadding}

        </ScrollView>
      </TouchableWithoutFeedback>
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
        groupInviteCode: this.state.inviteCode,
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
      "We have received your request!  If your group is legitimate and accepted you will receive a notification from " +
      "us when it's created",
      [
        {
          text: 'Hurray!',
          onPress: () => this.props.navigator.pop()
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
