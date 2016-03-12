'use strict';

var React = require('react-native');
var OverlayPage = require('../Common/OverlayPage');

var {
  Text,
  StyleSheet,
  ScrollView
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 3
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    padding: 5
  },
  paragraph: {
    fontSize: 12
  }
});

var EULAAgreementPage = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object.isRequired
  },

  render: function() {
    return (
      <OverlayPage
        content={this.renderContent()}
        onBackArrowPress={() => {this.props.navigator.pop();}}
        bannerTitle='EULA'/>
    );
  },

  renderContent: function() {
    return (
      <ScrollView style={styles.container}>

        <Text style={styles.heading}>
          Youni Terms of Agreement
        </Text>
        <Text style={styles.paragraph}>
          This End User License Agreement (“Agreement”) is between you and Youni and governs use of this app made available through the Apple App Store. By installing the Youni App, you agree to be bound by this Agreement and understand that there is no tolerance for objectionable content. If you do not agree with the terms and conditions of this Agreement, you are not entitled to use the Youni App.
          In order to ensure Youni provides the best experience possible for everyone, we strongly enforce a no tolerance policy for objectionable content. If you see inappropriate content, please use the “Report as offensive” feature found under each post.
        </Text>

        <Text style={styles.heading}>
          1. Parties
        </Text>
        <Text style={styles.paragraph}>
          This Agreement is between you and Youni only, and not Apple, Inc. (“Apple”). Notwithstanding the foregoing, you acknowledge that Apple and its subsidiaries are third party beneficiaries of this Agreement and Apple has the right to enforce this Agreement against you. Youni, not Apple, is solely responsible for the Youni App and its content.
        </Text>

        <Text style={styles.heading}>
          2. Privacy
        </Text>
        <Text style={styles.paragraph}>
          Youni may collect and use information about your usage of the Youni App, including certain types of information from and about your device. Youni may use this information, as long as it is in a form that does not personally identify you, to measure the use and performance of the Youni App.
        </Text>

        <Text style={styles.heading}>
          3. Limited License
        </Text>
        <Text style={styles.paragraph}>
          Youni grants you a limited, non-exclusive, non-transferable, revocable license to use the Youni App for your personal, non-commercial purposes. You may only use the Youni App on Apple devices that you own or control and as permitted by the App Store Terms of Service.
        </Text>

        <Text style={styles.heading}>
          4. Age Restrictions
        </Text>
        <Text style={styles.paragraph}>
          By using the Youni App, you represent and warrant that (a) you are 17 years of age or older and you agree to be bound by this Agreement; (b) if you are under 17 years of age, you have obtained verifiable consent from a parent or legal guardian; and (c) your use of the Youni App does not violate any applicable law or regulation. Your access to the Youni App may be terminated without warning if Youni believes, in its sole discretion, that you are under the age of 17 years and have not obtained verifiable consent from a parent or legal guardian. If you are a parent or legal guardian and you provide your consent to your child’s use of the Youni App, you agree to be bound by this Agreement in respect to your child’s use of the Youni App.
        </Text>

        <Text style={styles.heading}>
          5. Objectionable Content Policy
        </Text>
        <Text style={styles.paragraph}>
          Content may not be submitted to Youni, who will moderate all content and ultimately decide whether or not to post a submission to the extent such content includes, is in conjunction with, or alongside any, Objectionable Content. Objectionable Content includes, but is not limited to: (i) sexually explicit materials; (ii) obscene, defamatory, libelous, slanderous, violent and/or unlawful content or profanity; (iii) content that infringes upon the rights of any third party, including copyright, trademark, privacy, publicity or other personal or proprietary right, or that is deceptive or fraudulent; (iv) content that promotes the use or sale of illegal or regulated substances, tobacco products, ammunition and/or firearms; and (v) gambling, including without limitation, any online casino, sports books, bingo or poker.
        </Text>

        <Text style={styles.heading}>
          6. Warranty
        </Text>
        <Text style={styles.paragraph}>
          Youni disclaims all warranties about the Youni App to the fullest extent permitted by law. To the extent any warranty exists under law that cannot be disclaimed, Youni, not Apple, shall be solely responsible for such warranty.
        </Text>

        <Text style={styles.heading}>
          7. Maintenance and Support
        </Text>
        <Text style={styles.paragraph}>
          Youni does provide minimal maintenance or support for it but not to the extent that any maintenance or support is required by applicable law, Youni, not Apple, shall be obligated to furnish any such maintenance or support.
        </Text>

        <Text style={styles.heading}>
          8. Product Claims
        </Text>
        <Text style={styles.paragraph}>
          Youni, not Apple, is responsible for addressing any claims by you relating to the Youni App or use of it, including, but not limited to: (i) any product liability claim; (ii) any claim that the Youni App fails to conform to any applicable legal or regulatory requirement; and (iii) any claim arising under consumer protection or similar legislation. Nothing in this Agreement shall be deemed an admission that you may have such claims.
        </Text>

        <Text style={styles.heading}>
          9. Third Party Intellectual Property Claims
        </Text>
        <Text style={styles.paragraph}>
          Youni shall not be obligated to indemnify or defend you with respect to any third party claim arising out or relating to the Youni App. To the extent Youni is required to provide indemnification by applicable law, Youni, not Apple, shall be solely responsible for the investigation, defense, settlement and discharge of any claim that the Youni App or your use of it infringes any third party intellectual property right.
        </Text>

      </ScrollView>
    );
  }

});

module.exports = EULAAgreementPage;
