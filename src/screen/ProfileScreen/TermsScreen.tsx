import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const PRIMARY = '#201c5c';
const MUTED = '#8B8AA3';
const TEXT = '#3a3a52';

const LAST_UPDATED = 'May 14, 2026';

type Section = {
  title: string;
  body: string;
};

const SECTIONS: Section[] = [
  {
    title: '1. Acceptance of Terms',
    body: 'By creating an account or using SaveGen, you agree to these Terms and Policies. If you do not agree, please do not use the app.',
  },
  {
    title: '2. Your Account',
    body: 'You are responsible for the accuracy of the information you provide and for keeping your account credentials secure. You must be at least 13 years old to use SaveGen.',
  },
  {
    title: '3. Use of the Service',
    body: 'SaveGen is provided to help you track your personal finances, set budgets, and review your spending. You agree to use the app only for lawful, personal, non-commercial purposes.',
  },
  {
    title: '4. Your Data',
    body: 'Transactions, budgets, and other information you enter are stored to provide the service to you. We do not sell your personal financial data to third parties. You may request deletion of your account and associated data at any time.',
  },
  {
    title: '5. Privacy',
    body: 'We collect and process your information as described in our Privacy Policy. This includes your email address, profile details, and the financial entries you choose to record.',
  },
  {
    title: '6. Accuracy of Information',
    body: 'SaveGen helps you organize and visualize your finances but does not provide professional financial, tax, or investment advice. You are solely responsible for the financial decisions you make.',
  },
  {
    title: '7. Service Availability',
    body: 'We aim to keep SaveGen available at all times, but we may occasionally need to perform maintenance or release updates that interrupt access. We are not liable for any losses resulting from downtime.',
  },
  {
    title: '8. Changes to These Terms',
    body: 'We may update these Terms from time to time. When we make material changes, we will notify you in the app or by email. Continued use of SaveGen after changes take effect means you accept the updated Terms.',
  },
  {
    title: '9. Termination',
    body: 'You may stop using SaveGen and delete your account at any time. We may suspend or terminate accounts that violate these Terms or applicable law.',
  },
  {
    title: '10. Contact Us',
    body: 'Questions about these Terms? Reach out to us at save-gen@gmail.com and we will get back to you.',
  },
];

const TermsScreen: React.FC = () => {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <Text style={styles.heading}>Terms and Policies</Text>
      <Text style={styles.updated}>Last updated {LAST_UPDATED}</Text>

      <Text style={styles.intro}>
        Welcome to SaveGen. These Terms and Policies explain the rules for
        using our app and how we handle your information. Please read them
        carefully.
      </Text>

      <View style={styles.divider} />

      {SECTIONS.map(section => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.sectionBody}>{section.body}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 48,
  },
  heading: {
    fontSize: 24,
    fontFamily: 'Montserrat-Bold',
    color: PRIMARY,
  },
  updated: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: 'Montserrat-SemiBold',
    color: MUTED,
    letterSpacing: 0.4,
  },
  intro: {
    marginTop: 16,
    fontSize: 14,
    fontFamily: 'Montserrat',
    color: TEXT,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: '#ECEAF5',
    marginVertical: 20,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'Montserrat-Bold',
    color: PRIMARY,
    marginBottom: 6,
  },
  sectionBody: {
    fontSize: 14,
    fontFamily: 'Montserrat',
    color: TEXT,
    lineHeight: 22,
  },
  footerNote: {
    marginTop: 12,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#F5F4FB',
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Montserrat-SemiBold',
    color: MUTED,
    lineHeight: 18,
  },
});

export default TermsScreen;
