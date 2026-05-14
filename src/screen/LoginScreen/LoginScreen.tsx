import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useState } from 'react';
import FormInput from '../../components/FormInput';
import Divider from '../../components/Divider';
import Button from '../../components/Button';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../constants/navigation';
import { useAuth } from '../../context/AuthContext';

type LoginScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { signIn, signInAsGuest } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [guestSubmitting, setGuestSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Missing fields', 'Please enter your email and password.');
      return;
    }
    try {
      setSubmitting(true);
      await signIn(email.trim(), password);
    } catch (error) {
      Alert.alert(
        'Login failed',
        error instanceof Error ? error.message : 'Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleGuest = async () => {
    try {
      setGuestSubmitting(true);
      await signInAsGuest();
    } catch (error) {
      Alert.alert(
        'Could not start guest session',
        error instanceof Error ? error.message : 'Please try again.',
      );
    } finally {
      setGuestSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.backgroundImage}
        source={require('../../../assets/ui/background1.png')}
        resizeMode="cover">
        <View style={styles.contentContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.text}>Log in to continue saving</Text>
          </View>
          <View style={styles.formContainer}>
            <View style={styles.inputFormContainer}>
              <FormInput
                title="Email Address"
                placeholder="yours@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
              <FormInput
                title="Password"
                placeholder="*************"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
              />
              <Button
                buttonStyle={styles.primaryButton}
                title={submitting ? 'Logging in...' : 'Log in'}
                onPress={handleLogin}
                activeOpacity={submitting ? 1 : 0.8}>
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryButtonText}>Log in</Text>
                )}
              </Button>
            </View>

            <Divider text="or" />

            <View style={styles.buttonContainer}>
              <Button
                title="Continue as Guest"
                onPress={handleGuest}
                buttonStyle={styles.guestButtonContainer}
                activeOpacity={guestSubmitting ? 1 : 0.8}>
                {guestSubmitting ? (
                  <ActivityIndicator color="#201c5c" />
                ) : (
                  <Text style={styles.guestButtonText}>Continue as Guest</Text>
                )}
              </Button>
            </View>

            <TouchableOpacity
              style={styles.footerLink}
              onPress={() => navigation.navigate('Register')}>
              <Text style={styles.footerText}>
                Don't have an account?{' '}
                <Text style={styles.footerLinkText}>Sign up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
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
    marginTop: '25%',
    paddingHorizontal: '5%',
  },
  primaryButton: {
    backgroundColor: '#201c5c',
    paddingVertical: 12,
    borderRadius: 15,
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: '#ffffff',
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 15,
    marginTop: 30,
  },
  formContainer: {
    paddingHorizontal: '5%',
    backgroundColor: '#ffffff',
    paddingVertical: 40,
    height: '100%',
    borderRadius: 30,
  },
  title: {
    fontSize: 40,
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
  guestButtonContainer: {
    paddingHorizontal: 30,
    backgroundColor: '#F1EEFF',
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestButtonText: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: '#201c5c',
    textAlign: 'center',
  },
  footerLink: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Montserrat',
    color: '#666666',
  },
  footerLinkText: {
    fontFamily: 'Montserrat-Bold',
    color: '#201c5c',
  },
});

export default LoginScreen;
