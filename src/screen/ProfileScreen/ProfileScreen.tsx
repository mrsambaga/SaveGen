import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useState } from 'react';
import ProfileImage from './ProfileImage';
import SettingsSection from './SettingsSection';
import { useUser } from '../../context/UserContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../constants/navigation';

type ProfileScreenProps = {
  navigation: StackNavigationProp<RootStackParamList>;
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [userProfileImage] = useState<string | null>(null);
  const { user } = useUser();
  const userName = user?.username || 'User';
  const email = user?.email || 'No email';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ImageBackground
        style={styles.backgroundImage}
        source={require('../../../assets/ui/background1.png')}
        resizeMode="cover">
        <View style={styles.contentContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Profile</Text>
          </View>

          <View style={styles.bottomContainer}>
            <View style={styles.profileImageContainer}>
              <ProfileImage
                imageUri={userProfileImage}
                fullName={userName}
                size={110}
              />
            </View>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.email}>{email}</Text>

            <SettingsSection navigation={navigation} />
          </View>
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loginTextContainer: {
    textAlign: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    width: '100%',
  },
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  contentContainer: {
    gap: 40,
    width: '100%',
  },
  inputFormContainer: {
    gap: 20,
    marginBottom: 25,
  },
  textContainer: {
    marginTop: '15%',
    marginBottom: '10%',
    paddingHorizontal: '5%',
  },
  button: {
    paddingVertical: 10,
    borderRadius: 15,
  },
  buttonContainer: {
    gap: 15,
    marginTop: 30,
  },
  bottomContainer: {
    paddingHorizontal: '5%',
    backgroundColor: '#ffffff',
    height: '100%',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  title: {
    fontSize: 45,
    fontFamily: 'Montserrat-Bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  text: {
    fontSize: 20,
    fontFamily: 'Montserrat-SemiBold',
    color: '#ffffff',
    textAlign: 'center',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    color: '#555',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginTop: -55,
  },
  userName: {
    fontSize: 24,
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'Montserrat-Bold',
    color: '#201c5c',
  },
  email: {
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'Montserrat',
    color: '#201c5c',
    opacity: 0.7,
  },
  settings: {
    flex: 1,
  },
});

export default ProfileScreen;
