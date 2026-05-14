import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import SettingsOption from './SettingsOption';
import ContactSupportModal from './ContactSupportModal';
import {
  faFileText,
  faGlobe,
  faHeadphones,
  faUser,
  faComment,
  faCreditCard,
  faUniversity,
} from '@fortawesome/free-solid-svg-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../constants/navigation';

type SettingsSectionProps = {
  navigation: StackNavigationProp<RootStackParamList>;
};

const SettingsSection: React.FC<SettingsSectionProps> = ({ navigation }) => {
  const [isSupportVisible, setSupportVisible] = useState(false);

  const handleLanguagePress = () => {
    Alert.alert(
      'Language',
      'SaveGen is currently available in English only. More languages are coming soon.',
    );
  };

  const generalOptions = [
    {
      iconName: faUser,
      title: 'Account',
      onPress: () => navigation.navigate('Account'),
    },
    {
      iconName: faGlobe,
      title: 'Language',
      value: 'English',
      locked: true,
      onPress: handleLanguagePress,
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
      onPress: () => setSupportVisible(true),
    },
    {
      iconName: faFileText,
      title: 'Terms and Policies',
      onPress: () => navigation.navigate('Terms'),
    },

    {
      iconName: faComment,
      title: 'Share Feedback',
      onPress: () => console.log('Share Feedback pressed'),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.settingsSection}>
        <Text style={styles.settingsTitle}>General</Text>
        <View style={styles.settingsOptions}>
          {generalOptions.map((option, index) => (
            <SettingsOption
              key={index}
              iconName={option.iconName}
              title={option.title}
              onPress={option.onPress}
              value={option.value}
              locked={option.locked}
            />
          ))}
        </View>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.settingsTitle}>Support</Text>
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

      <ContactSupportModal
        visible={isSupportVisible}
        onClose={() => setSupportVisible(false)}
      />
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
    fontSize: 13,
    fontFamily: 'Montserrat-Bold',
    color: '#8B8AA3',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginLeft: 4,
  },
  settingsOptions: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECEAF5',
    overflow: 'hidden',
  },
});
