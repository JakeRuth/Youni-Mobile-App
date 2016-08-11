'use strict';

var React = require('react');
var ReactNative = require('react-native');

var ChangeCoverImage = require('../Group/Admin/Edit/ChangeCoverImage');
var ChangeBadgeImage = require('../Group/Admin/Edit/ChangeBadgeImage');
var EditProfileFieldInput = require('../Common/EditProfileFieldInput');
var YouniHeader = require('../Common/YouniHeader');
var Spinner = require('../Common/Spinner');
var BackArrow = require('../Common/BackArrow');

var userLoginMetadataStore = require('../../stores/UserLoginMetadataStore');
var AjaxUtils = require('../../Utils/Common/AjaxUtils');
var Colors = require('../../Utils/Common/Colors');

var {
  View,
  Text,
  AlertIOS,
  TextInput,
  StyleSheet
} = ReactNative;

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerContentContainer: {
    flexDirection: 'row'
  },
  pageHeader: {
    flex: 1,
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center'
  },
  cancelLink: {
    fontSize: 16,
    textAlign: 'left',
    padding: 12,
    paddingTop: 2,
    width: 75
  },
  finishEditLink: {
    fontSize: 16,
    textAlign: 'right',
    padding: 12,
    paddingTop: 2,
    width: 75
  },
  editInformationControlsContainer: {
    padding: 10
  },
  editDescription: {
    flex: 1,
    height: 80,
    fontSize: 16
  }
});

var GroupEditInfoPopup = React.createClass({

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
    }).isRequired,
    onPageReturnCallback: React.PropTypes.func.isRequired,
    navigator: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      isRequestInFlight: false,
      name: this.props.group.name,
      abbreviatedName: this.props.group.abbreviatedName,
      description: this.props.group.description
    };
  },

  render: function () {
    var editDescriptionPlaceholder;

    if (this.props.group.description) {
      editDescriptionPlaceholder = this.props.group.description;
    }
    else {
      editDescriptionPlaceholder = 'Fill in group description';
    }

    return (
      <View style={styles.container}>

        {this._renderHeader()}

        <ChangeCoverImage {...this.props}/>

        <View style={styles.editInformationControlsContainer}>
          <EditProfileFieldInput
            label="Title"
            value={this.state.name}
            placeholder={this.props.group.name}
            onChangeText={(text) => this.setState({name: text}) }
            maxLength={35}/>
          <EditProfileFieldInput
            label="Abbreviation"
            value={this.state.abbreviatedName}
            placeholder={this.props.group.abbreviatedName}
            onChangeText={(text) => this.setState({abbreviatedName: text}) }
            maxLength={5}/>
          <TextInput
            style={styles.editDescription}
            onChangeText={(text) => this.setState({description: text}) }
            value={this.state.description}
            placeholder={editDescriptionPlaceholder}
            placeholderTextColor={Colors.MED_GRAY}
            multiline={true}
            maxLength={125}
            keyboardType="twitter"/>
          <ChangeBadgeImage
            groupIdString={this.props.group.id}
            groupBadgeImageUrl={this.props.group.badgeImageUrl}/>
        </View>

      </View>
    );
  },

  _renderHeader: function() {
    return (
      <YouniHeader style={styles.headerContentContainer}>
        <Text
          style={[styles.cancelLink, { color: Colors.getPrimaryAppColor() }]}
          onPress={() => {
            this.props.onPageReturnCallback();
            this.props.navigator.pop();
          }}>
          Cancel
        </Text>
        <Text style={[styles.pageHeader, { color: Colors.getPrimaryAppColor() }]}>
          Edit Profile
        </Text>
        <Text
          style={[styles.finishEditLink, { color: Colors.getPrimaryAppColor() }]}
          onPress={this._onFinishEdittingPress}>
          Done
        </Text>
      </YouniHeader>
    );
  },

  _onFinishEdittingPress: function() {
    if (!this.state.name || !this.state.abbreviatedName || !this.state.description) {
      AlertIOS.alert(
        'Fields cannot be blank.',
        '',
        [
          {
            text: 'Alright'
          }
        ]
      );
    }
    else {
      this.updateGroupInformation();
    }
  },

  updateGroupInformation: function() {
    var that = this;

    this.setState({
      isRequestInFlight: true
    });

    AjaxUtils.ajax(
      '/group/updateInformation',
      {
        requestingUserIdString: userLoginMetadataStore.getUserId(),
        groupIdString: this.props.group.id,
        name: this.state.name,
        abbreviatedName: this.state.abbreviatedName,
        description: this.state.description
      },
      (res) => {
        that.setState({
          isRequestInFlight: false
        });
        this.props.onPageReturnCallback();
        this.props.navigator.pop();
      },
      () => {
        that.setState({
          isRequestInFlight: false
        });

        AlertIOS.alert(
          'A problem occurred while updating group information.',
          'If this problem persists please contact support@youniapp.com',
          [
            {
              text: 'Okay'
            }
          ]
        );
      }
    );
  }

});

module.exports = GroupEditInfoPopup;
