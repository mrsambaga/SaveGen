import {StackNavigationProp} from '@react-navigation/stack';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type RootStackParamList = {
  Landing: undefined;
  Login: undefined;
};

type LandingProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>;
};

const LandingScreen: React.FC<LandingProps> = ({navigation}) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.backgroundImage}
        source={require('../../../assets/ui/LandingPage.png')}
        resizeMode="cover">
        <View style={styles.contentContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>SaveGen</Text>
            <Text style={styles.text}>
              Manage your spending and save your money!
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.8}>
              <Text style={styles.buttonText}>Start Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  textContainer: {
    marginTop: '25%',
    paddingHorizontal: '5%',
  },
  buttonContainer: {
    marginBottom: '20%',
    paddingHorizontal: '5%',
  },
  title: {
    fontSize: 60,
    fontFamily: 'Montserrat-Bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  text: {
    fontSize: 24,
    fontFamily: 'Montserrat-SemiBold',
    color: '#ffffff',
    textAlign: 'center',
  },
  buttonText: {
    fontSize: 24,
    fontFamily: 'Montserrat-SemiBold',
    color: '#201c5c',
    textAlign: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#84e1ec',
    paddingVertical: 10,
    paddingHorizontal: 70,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default LandingScreen;
