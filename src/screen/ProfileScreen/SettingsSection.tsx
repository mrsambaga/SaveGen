import {StyleSheet, Text, View} from 'react-native';
import SettingsOption from './SettingsOption';
import {
  faUniversity,
  faUser,
  faGlobe,
  faCreditCard,
  faHeadphones,
  faComment,
  faFileText,
} from '@fortawesome/free-solid-svg-icons';

const SettingsSection: React.FC = () => {
  const generalOptions = [
    {
      iconName: faUser,
      iconType: 'solid',
      title: 'Account',
      onPress: () => console.log('Account pressed'),
    },
    {
      iconName: faGlobe,
      title: 'Language',
      onPress: () => console.log('Language pressed'),
    },
    {
      iconName: faUniversity,
      title: 'Bank Accounts & E-Wallets',
      onPress: () => console.log('Bank Accounts pressed'),
    },
    {
      iconName: faCreditCard,
      title: 'Payment Methods',
      onPress: () => console.log('Payment Methods pressed'),
    },
  ];

  const supportOptions = [
    {
      iconName: faHeadphones,
      title: 'Contact Support',
      onPress: () => console.log('Contact Support pressed'),
    },
    {
      iconName: faComment,
      title: 'Share Feedback',
      onPress: () => console.log('Share Feedback pressed'),
    },
    {
      iconName: faFileText,
      title: 'Terms and Policies',
      onPress: () => console.log('Terms and Policies pressed'),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.settingsSection}>
        <Text style={styles.settingsTitle}>{'General'}</Text>
        <View style={styles.settingsOptions}>
          {generalOptions.map((option, index) => (
            <SettingsOption
              key={index}
              iconName={option.iconName}
              title={option.title}
              onPress={option.onPress}
            />
          ))}
        </View>
      </View>
      <View style={styles.settingsSection}>
        <Text style={styles.settingsTitle}>{'Support'}</Text>
        <View style={styles.settingsOptions}>
          {supportOptions.map((option, index) => (
            <SettingsOption
              key={index}
              iconName={option.iconName}
              title={option.title}
              onPress={option.onPress}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default SettingsSection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  settingsSection: {
    marginBottom: 24,
  },
  settingsTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    color: '#201c5c',
    marginBottom: 12,
  },
  settingsOptions: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingsOptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
});
