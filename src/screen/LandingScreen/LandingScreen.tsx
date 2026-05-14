import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../../components/Button';
import { LandingProps } from '../../constants/props';

const LandingScreen: React.FC<LandingProps> = ({ navigation }) => {
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
              title="Get Started"
              onPress={() => navigation.navigate('Register')}
              buttonStyle={styles.primaryButton}
              textStyle={styles.primaryButtonText}
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
    marginBottom: '15%',
    paddingHorizontal: '5%',
    gap: 14,
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
  primaryButton: {
    backgroundColor: '#84e1ec',
    paddingVertical: 12,
    paddingHorizontal: 70,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  primaryButtonText: {
    fontSize: 22,
    fontFamily: 'Montserrat-SemiBold',
    color: '#201c5c',
    textAlign: 'center',
  },
  secondaryButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: '#ffffff',
    textDecorationLine: 'underline',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
});

export default LandingScreen;
