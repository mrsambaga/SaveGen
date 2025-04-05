import {StackNavigationProp} from '@react-navigation/stack';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import Button from '../../components/Button';

type RootStackParamList = {
  Landing: undefined;
  Register: undefined;
};

type LandingProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Register'>;
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
            <Button
              title="Start Now"
              onPress={() => navigation.navigate('Register')}
              buttonStyle={styles.button}
              textStyle={styles.buttonText}
            />
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
