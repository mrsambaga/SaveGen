import {StackNavigationProp} from '@react-navigation/stack';
import {Image, ImageBackground, StyleSheet, Text, View} from 'react-native';
import FormInput from '../../components/FormInput';
import {useState} from 'react';
import Divider from '../../components/Divider';
import Button from '../../components/Button';

type RootStackParamList = {
  Landing: undefined;
  MainTabs: undefined;
};

type LoginProps = {
  navigation: StackNavigationProp<RootStackParamList, 'MainTabs'>;
};

const RegisterScreen: React.FC<LoginProps> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.backgroundImage}
        source={require('../../../assets/ui/background1.png')}
        resizeMode="cover">
        <View style={styles.contentContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Sign up now</Text>
            <Text style={styles.text}>Join SaveGen and save your money</Text>
          </View>
          <View style={styles.formContainer}>
            <View style={styles.inputFormContainer}>
              <FormInput
                title="Email Address"
                placeholder="yours@email.com"
                value={email}
                onChangeText={setEmail}
              />
              <FormInput
                title="Password"
                placeholder="*************"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
              />
              <Button
                buttonStyle={styles.button}
                title="Sign up"
                onPress={() => navigation.navigate('MainTabs')}
              />
            </View>
            <Divider text="or continue with" />
            <View style={styles.buttonContainer}>
              <Button
                title="Sing in with Google"
                onPress={() => navigation.navigate('Landing')}
                buttonStyle={styles.googleButtonContainer}>
                <View style={styles.googleIconContainer}>
                  <Image
                    source={require('../../../assets/icons/google.png')}
                    style={styles.icons}
                  />
                </View>
                <View style={styles.loginTextContainer}>
                  <Text style={styles.loginButtonText}>
                    Sign in with Google
                  </Text>
                </View>
              </Button>
              <Button
                title="Sing in with Facebook"
                onPress={() => navigation.navigate('MainTabs')}
                buttonStyle={styles.facebookButtonContainer}>
                <View style={styles.facebookIconContainer}>
                  <Image
                    source={require('../../../assets/icons/facebook.png')}
                    style={styles.icons}
                  />
                </View>
                <View style={styles.loginTextContainer}>
                  <Text style={styles.loginButtonText}>
                    Sign in with Facebook
                  </Text>
                </View>
              </Button>
              <Button
                title="Login with email"
                onPress={() => navigation.navigate('MainTabs')}
                buttonStyle={styles.mailButtonContainer}>
                <View style={styles.mailIconContainer}>
                  <Image
                    source={require('../../../assets/icons/mail.png')}
                    style={styles.icons}
                  />
                </View>
                <View style={styles.loginTextContainer}>
                  <Text style={styles.loginButtonText}>Login with Email</Text>
                </View>
              </Button>
            </View>
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
  button: {
    paddingVertical: 10,
    borderRadius: 15,
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
  loginButtonText: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: '#ffffff',
    textAlign: 'center',
  },
  icons: {
    width: 20,
    height: 20,
  },
  googleButtonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 30,
    backgroundColor: '#3783fb',
    paddingVertical: 10,
    borderRadius: 15,
  },
  googleIconContainer: {
    padding: 2,
    backgroundColor: '#ffffff',
    borderRadius: 40,
  },
  facebookButtonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 30,
    backgroundColor: '#3b5999',
    paddingVertical: 10,
    borderRadius: 15,
  },
  facebookIconContainer: {
    padding: 2,
    backgroundColor: '#ffffff',
    height: 23,
    borderRadius: 40,
  },
  mailButtonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 30,
    backgroundColor: '#12c48a',
    paddingVertical: 10,
    borderRadius: 15,
  },
  mailIconContainer: {
    padding: 2,
    borderRadius: 40,
  },
});

export default RegisterScreen;
